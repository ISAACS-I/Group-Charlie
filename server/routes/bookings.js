const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { protect } = require('../middleware/auth');
const Booking = require('../models/Booking');
const GroupBooking = require('../models/GroupBooking');
const Event = require('../models/Event');
const { sendGroupQREmails } = require('../utils/sendEmail');

// POST /api/bookings
// Create individual booking
router.post('/', protect, async (req, res) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user already booked this event
    const existingBooking = await Booking.findOne({
      user: req.user._id,
      event: eventId,
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'You have already booked this event' });
    }

    const booking = await Booking.create({
      user: req.user._id,
      event: eventId,
      status: 'confirmed',
    });

    await booking.populate('event', 'title date time location imageBg');

    res.status(201).json({
      message: 'Event booked successfully',
      booking,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/bookings/my
// Get user's individual bookings
router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('event', 'title date time location imageBg category status')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/bookings/attendees
// Get all attendees across all events owned by the logged-in organiser
router.get('/attendees', protect, async (req, res) => {
  try {
    // Get all events owned by this organiser
    const events = await Event.find({ organiser: req.user._id }).select('_id title');
    const eventIds = events.map(e => e._id);

    // Get all bookings for those events
    const bookings = await Booking.find({ event: { $in: eventIds } })
      .populate('user',  'firstName lastName email')
      .populate('event', 'title')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/bookings/event/:eventId
// Get all bookings for a specific event (organiser only)
router.get('/event/:eventId', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ event: req.params.eventId })
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/bookings/group
// Create group booking
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

// GET /api/bookings/group
// Get user's group bookings
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

// DELETE /api/bookings/:id
// Cancel a booking
router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});







module.exports = router;