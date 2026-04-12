// routes/payment.js

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Simple Booking Model (temporary if you don’t have one yet)
const Booking = mongoose.model("Booking", new mongoose.Schema({
  user_id: String,
  event_id: String,
  total_amount: Number,
  status: { type: String, default: "pending" }
}));

// 🔹 PAYMENT ROUTE
router.post("/pay", async (req, res) => {
  try {
    const { bookingId, method } = req.body;

    // 1. Check if booking exists
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // 2. Check if already paid
    if (booking.status === "paid") {
      return res.json({
        success: false,
        message: "Already paid"
      });
    }

    // 3. Simulate payment success
    booking.status = "paid";

    await booking.save();

    // 4. Send response
    res.json({
      success: true,
      message: "Payment successful"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

module.exports = router;
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorised, no token' });
  }

  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch {
    res.status(401).json({ message: 'Not authorised, invalid token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only' });
  }
  next();
};

module.exports = { protect, adminOnly };
