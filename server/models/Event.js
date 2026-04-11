const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  category:    { type: String },
  date:        { type: Date },
  time:        { type: String },
  location:    { type: String },
  price:       { type: Number, default: 0 },
  imageBg:     { type: String },
  status:      { type: String, enum: ['Active', 'Upcoming', 'Draft'], default: 'Draft' },
  organiser:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  capacity:    { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);