const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const User = require('../models/User');

// GET /api/analytics - Auth bypassed for development
router.get('/', async (req, res) => {
  try {
    const adminUser = await User.findOne({ email: 'demo@eventhub.com' });

    if (!adminUser) {
      return res.status(500).json({ message: 'Admin user not found. Run seed script first.' });
    }

    req.user = adminUser;
    const organiserId = req.user._id;

    // Get all events by this organiser
    const events = await Event.find({ organiser: organiserId });
    const eventIds = events.map(e => e._id);

    // Total attendees across all events
    const totalAttendees = await Booking.countDocuments({
      event: { $in: eventIds },
      status: 'confirmed',
    });

    // Attendance rate — scanned vs confirmed
    const totalScanned = await Booking.countDocuments({
      event: { $in: eventIds },
      scannedAt: { $exists: true },
    });
    const attendanceRate = totalAttendees > 0
      ? Math.round((totalScanned / totalAttendees) * 100)
      : 0;

    // Monthly attendance for chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyData = await Booking.aggregate([
      {
        $match: {
          event: { $in: eventIds },
          status: 'confirmed',
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          value: { $sum: 1 },
        },
      },
      { $sort: { '_id': 1 } },
    ]);

    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const attendanceData = monthlyData.map(m => ({
      month: monthNames[m._id - 1],
      value: m.value,
    }));

    // Event performance breakdown
    const performance = await Promise.all(
      events.map(async (event) => {
        const total = await Booking.countDocuments({ event: event._id, status: 'confirmed' });
        const scanned = await Booking.countDocuments({ event: event._id, scannedAt: { $exists: true } });
        const progress = total > 0 ? Math.round((scanned / total) * 100) : 0;
        return {
          name: event.title,
          sub: `${total} attendees`,
          progress,
          total,
        };
      })
    );

    // Top performing event
    const top = performance.sort((a, b) => b.total - a.total)[0] ?? null;

    // Age group breakdown from attendee DOBs
    const now = new Date();
    const bookedUserIds = await Booking.distinct('user', {
      event: { $in: eventIds },
      status: 'confirmed',
    });
    const attendees = await User.find({ _id: { $in: bookedUserIds } }).select('dob');

    const ageGroups = { 'Under 18': 0, '18-24': 0, '25-34': 0, '35-44': 0, '45+': 0 };

    attendees.forEach(user => {
      if (!user.dob) return;
      const age = Math.floor((now - new Date(user.dob)) / (365.25 * 24 * 60 * 60 * 1000));
      if (age < 18) ageGroups['Under 18']++;
      else if (age <= 24) ageGroups['18-24']++;
      else if (age <= 34) ageGroups['25-34']++;
      else if (age <= 44) ageGroups['35-44']++;
      else ageGroups['45+']++;
    });

    const ageData = Object.entries(ageGroups).map(([group, count]) => ({ group, count }));

    res.json({
      totalAttendees,
      attendanceRate,
      attendanceData,
      performance,
      top,
      ageData,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;