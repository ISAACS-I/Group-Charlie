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
 