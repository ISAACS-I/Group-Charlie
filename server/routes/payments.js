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

// 🔹 GET BOOKING BY ID
router.get("/booking/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }
    
    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

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