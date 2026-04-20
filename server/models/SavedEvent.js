const mongoose = require('mongoose');

const savedEventSchema = new mongoose.Schema({
  user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
}, { timestamps: true });

// Prevent duplicate saves
savedEventSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('SavedEvent', savedEventSchema);