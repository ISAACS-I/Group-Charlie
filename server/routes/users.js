const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { protect, adminOnly } = require('../middleware/auth');
const User = require('../models/User');
const Booking = require('../models/Booking');
const SavedEvent = require('../models/SavedEvent');

// GET /api/users/me
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/users/me
router.put('/me', protect, async (req, res) => {
  try {
    const { firstName, lastName, phone, gender, dob } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, phone, gender, dob },
      { new: true, runValidators: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/users/me/password
router.put('/me/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/me/qr
router.get('/me/qr', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('qrCode firstName lastName');
    const scanHistory = await Booking.find({
      user: req.user._id,
      scannedAt: { $exists: true },
    })
      .populate('event', 'title date location')
      .sort({ scannedAt: -1 });

    res.json({
      qrCode: user.qrCode,
      name: `${user.firstName} ${user.lastName}`,
      scanHistory: scanHistory.map(b => ({
        eventTitle: b.event.title,
        eventDate: b.event.date,
        location: b.event.location,
        scannedAt: b.scannedAt,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// GET /api/users/me/bookings
router.get('/me/bookings', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('event', 'title date time location imageBg category status')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// GET /api/users/me/saved
router.get('/me/saved', protect, async (req, res) => {
  try {
    const saved = await SavedEvent.find({ user: req.user._id })
      .populate('event', 'title date time location imageBg category description')
      .sort({ createdAt: -1 });
    res.json(saved.map(s => s.event));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/users/me/saved/:eventId
router.post('/me/saved/:eventId', protect, async (req, res) => {
  try {
    const saved = await SavedEvent.create({
      user: req.user._id,
      event: req.params.eventId,
    });
    res.status(201).json({ message: 'Event saved', saved });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Event already saved' });
    }
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/users/me/saved/:eventId
router.delete('/me/saved/:eventId', protect, async (req, res) => {
  try {
    await SavedEvent.findOneAndDelete({
      user: req.user._id,
      event: req.params.eventId,
    });
    res.json({ message: 'Event removed from saved' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// GET /api/users
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/users/:id/role
router.put('/:id/role', protect, adminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/users/me
router.delete('/me', protect, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    await Booking.deleteMany({ user: req.user._id });
    await SavedEvent.deleteMany({ user: req.user._id });
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;