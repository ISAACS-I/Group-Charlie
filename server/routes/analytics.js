const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const User = require('../models/User'); 

// GET /api/analytics - Auth bypassed for development
router.get('/', async (req, res) => {
  try {
    // Mock user for development - use the seeded admin user
    const adminUser = await User.findOne({ email: 'demo@eventhub.com' });
    
    if (!adminUser) {
      return res.status(500).json({ message: 'Admin user not found. Run seed script first.' });
    }
    
    req.user = adminUser; // Mock the authenticated user
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

    res.json({
      totalAttendees,
      attendanceRate,
      attendanceData,
      performance,
      top,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;