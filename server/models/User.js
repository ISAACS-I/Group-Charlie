const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName:  { type: String, required: true },
  lastName:   { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  phone:      { type: String },
  gender:     { type: String },
  dob:        { type: Date },
  password:   { type: String, required: true },
  role:       { type: String, enum: ['user', 'admin'], default: 'user' },
  qrCode:     { type: String, unique: true }, // unique identity QR per user
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);