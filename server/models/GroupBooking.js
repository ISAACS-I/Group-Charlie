const mongoose = require('mongoose');

const groupBookingSchema = new mongoose.Schema({
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  members: [
    {
      name: { type: String, required: true },
      email: { type: String, required: true },
      qrCode: { type: String, required: true },
      scannedAt: { type: Date },
    }
  ],
  status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
}, { timestamps: true });

module.exports = mongoose.models.GroupBooking || mongoose.model('GroupBooking', groupBookingSchema);