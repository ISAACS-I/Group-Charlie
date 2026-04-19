const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { protect } = require('../middleware/auth');
const GroupBooking = require('../models/GroupBooking');
const Event = require('../models/Event');
const { sendGroupQREmails } = require('../utils/sendEmail');

// POST /api/bookings/group
router.post('/group', protect, async (req, res) => {
  try {
    const { eventId, members } = req.body;

    if (!members || members.length === 0) {
      return res.status(400).json({ message: 'No members provided' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const membersWithQR = members.map(member => ({
      name: member.name,
      email: member.email,
      qrCode: uuidv4(),
    }));

    const groupBooking = await GroupBooking.create({
      bookedBy: req.user._id,
      event: eventId,
      members: membersWithQR,
    });

    await sendGroupQREmails(membersWithQR, event.title);

    res.status(201).json({
      message: `Group booking created. QR passes sent to ${membersWithQR.length} people.`,
      groupBooking,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/bookings/group/my
router.get('/group/my', protect, async (req, res) => {
  try {
    const bookings = await GroupBooking.find({ bookedBy: req.user._id })
      .populate('event', 'title date location imageBg')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;