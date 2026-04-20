const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { protect } = require('../middleware/auth');

// GET /api/events
router.get('/', async (req, res) => {
  try {
    const { category, status } = req.query;
    let query = {};
    if (category) query.category = category;
    if (status)   query.status   = status;

    const events = await Event.find(query)
      .populate('organiser', 'firstName lastName email phone')
      .sort({ date: 1 });

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/events/categories/counts  ← must be before /:id
router.get('/categories/counts', async (req, res) => {
  try {
    const counts = await Event.aggregate([
      { $match: { status: { $in: ['Active', 'Upcoming'] } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const result = counts.reduce((acc, item) => {
      if (item._id) acc[item._id] = item.count;
      return acc;
    }, {});

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/events/my  ← must be before /:id
router.get('/my', protect, async (req, res) => {
  try {
    const { status } = req.query;
    const query = { organiser: req.user._id };
    if (status) query.status = status;

    const events = await Event.find(query)
      .populate('organiser', 'firstName lastName email phone')
      .sort({ date: -1 });

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/events/:id  ← all specific routes must be above this
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organiser', 'firstName lastName email phone');

    if (!event) return res.status(404).json({ message: 'Event not found' });

    res.json(event);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(500).json({ message: err.message });
  }
});

// POST /api/events
router.post('/', protect, async (req, res) => {
  try {
    const {
      title, description, category, type,
      date, time, duration, location, directions,
      price, capacity, hasAgeRestriction, minAge,
      imageBg, status, thumbnail, banner, gallery,
    } = req.body;

    if (!title) return res.status(400).json({ message: 'Event title is required' });
    if (!date)  return res.status(400).json({ message: 'Event date is required' });

    const event = await Event.create({
      title, description, category, type,
      date, time, duration, location, directions,
      price:             parseFloat(price) || 0,
      capacity:          parseInt(capacity) || null,
      hasAgeRestriction: hasAgeRestriction || false,
      minAge:            hasAgeRestriction ? parseInt(minAge) : null,
      imageBg, thumbnail, banner, gallery,
      status:            status || 'Draft',
      organiser:         req.user._id,
    });

    await event.populate('organiser', 'firstName lastName email phone');
    res.status(201).json({ message: 'Event created successfully', event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/events/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.organiser.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorised to update this event' });
    }

    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      { ...req.body, organiser: event.organiser },
      { new: true, runValidators: true }
    ).populate('organiser', 'firstName lastName email phone');

    res.json({ message: 'Event updated successfully', event: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/events/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.organiser.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorised to delete this event' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;