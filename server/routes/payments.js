const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// GET BOOKING BY ID
router.get("/booking/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// PAYMENT ROUTE
router.post("/pay", async (req, res) => {
  try {
    const { bookingId, method } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.status === "paid") {
      return res.json({ success: false, message: "Already paid" });
    }

    booking.status = "paid";
    await booking.save();

    res.json({ success: true, message: "Payment successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;