const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  type: { type: String },
  date: { type: Date },
  time: { type: String },
  duration: { type: String },
  location: { type: String },
  directions: { type: String },
  price: { type: Number, default: 0 },
  imageBg: { type: String },
  thumbnail: { type: String, default: null }, // square card image
  banner: { type: String, default: null }, // hero image
  gallery: [{ type: String }],              // array of photo URLs
  status: { type: String, enum: ['Active', 'Upcoming', 'Draft'], default: 'Draft' },
  organiser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  capacity: { type: Number },
  hasAgeRestriction: { type: Boolean, default: false },
  minAge: { type: Number, default: null },
}, { timestamps: true });

module.exports = mongoose.models.Event || mongoose.model('Event', eventSchema);