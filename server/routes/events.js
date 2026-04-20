const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { protect } = require('../middleware/auth');

// GET /api/events
// Fetch all events with optional filters
router.get('/', async (req, res) => {
  try {
    const { category, status } = req.query;
    let query = {};

    if (category) query.category = category;
    if (status) query.status = status;

    const events = await Event.find(query)
      .populate('organiser', 'firstName lastName email phone')
      .sort({ date: 1 });

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/events/categories/counts
// Returns count of active/upcoming events per category
router.get('/categories/counts', async (req, res) => {
  try {
    const counts = await Event.aggregate([
      { $match: { status: { $in: ['Active', 'Upcoming'] } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    // Turn array into a plain object: { Technology: 5, Music: 3, ... }
    const result = counts.reduce((acc, item) => {
      if (item._id) acc[item._id] = item.count;
      return acc;
    }, {});

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/events/:id
// Fetch single event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organiser', 'firstName lastName email phone');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
 