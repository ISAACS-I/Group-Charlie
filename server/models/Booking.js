const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event:     { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  status:    { type: String, enum: ['confirmed', 'pending', 'cancelled'], default: 'confirmed' },
  scannedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);