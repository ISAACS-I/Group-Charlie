const express = require('express');
const router = express.Router();
const multer = require('multer');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// ─── Multer: profile picture uploads ─────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/profiles';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user._id}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

// ─── GET /api/settings ────────────────────────────────────────────────────────
// Returns current user's profile (no password)
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── PUT /api/settings/profile ────────────────────────────────────────────────
// Update name, email, phone, gender, dob
router.put('/profile', protect, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, gender, dob } = req.body;

    // Make sure the new email isn't already taken by someone else
    const taken = await User.findOne({ email, _id: { $ne: req.user._id } });
    if (taken) return res.status(400).json({ message: 'Email already in use' });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, email, phone, gender, dob },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully', user });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── PUT /api/settings/password ───────────────────────────────────────────────
// Verify current password, then set new one
router.put('/password', protect, async (req, res) => {
  try {
    const { current, newPassword, confirm } = req.body;

    if (!current || !newPassword || !confirm)
      return res.status(400).json({ message: 'All password fields are required' });

    if (newPassword !== confirm)
      return res.status(400).json({ message: 'New passwords do not match' });

    if (newPassword.length < 8)
      return res.status(400).json({ message: 'Password must be at least 8 characters' });

    // Fetch full user doc so we can call matchPassword
    const user = await User.findById(req.user._id);
    const isMatch = await user.matchPassword(current); // uses your existing method
    if (!isMatch)
      return res.status(400).json({ message: 'Current password is incorrect' });

    user.password = newPassword; // pre-save hook will hash it
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── PUT /api/settings/profile-picture ───────────────────────────────────────
// Upload a new profile picture (multipart/form-data, field: "profilePicture")
router.put('/profile-picture', protect, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: 'No file uploaded' });

    const user = await User.findById(req.user._id);

    // Delete old picture from disk if it exists
    if (user.profilePicture) {
      const oldPath = user.profilePicture.replace(/^\//, ''); // strip leading slash
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    user.profilePicture = `/uploads/profiles/${req.file.filename}`;
    await user.save();

    res.json({
      message: 'Profile picture updated',
      profilePicture: user.profilePicture,
    });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── DELETE /api/settings/profile-picture ────────────────────────────────────
router.delete('/profile-picture', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.profilePicture) {
      const filePath = user.profilePicture.replace(/^\//, '');
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      user.profilePicture = null;
      await user.save();
    }

    res.json({ message: 'Profile picture removed' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── POST /api/settings/qr-code ───────────────────────────────────────────────
// Generates a QR code on first call, returns existing one on subsequent calls
router.post('/qr-code', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Assign a UUID once — this becomes the user's permanent identity token
    if (!user.qrCode) {
      user.qrCode = uuidv4();
      await user.save();
    }

    // Generate base64 PNG from the stored UUID
    const qrCodeImage = await QRCode.toDataURL(user.qrCode, {
      width: 300,
      margin: 2,
      color: { dark: '#1e1b4b', light: '#ffffff' },
    });

    res.json({
      qrCodeId: user.qrCode,
      qrCodeImage, // use directly as <img src={qrCodeImage} />
    });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;