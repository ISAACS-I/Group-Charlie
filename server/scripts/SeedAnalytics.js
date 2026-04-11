require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected');
};

// Inline models to avoid import issues
const User = require('../models/User');
const Event = require('../models/Event');
const Booking = require('../models/Booking');

const seed = async () => {
  await connectDB();

  // Clear existing demo data
  await User.deleteMany({ email: 'demo@eventhub.com' });
  await Event.deleteMany({ title: { $in: ['Tech Summit 2026', 'Women in Business Forum', 'Live Music Night', 'Developer Meetup'] } });

  // Create demo admin user
  const admin = await User.create({
    firstName: 'Demo',
    lastName: 'Organiser',
    email: 'demo@eventhub.com',
    password: await bcrypt.hash('password123', 10),
    role: 'admin',
    qrCode: uuidv4(),
  });

  console.log('Created admin:', admin.email);

  // Create demo events
  const events = await Event.insertMany([
    {
      title: 'Tech Summit 2026',
      category: 'Technology',
      date: new Date('2026-03-28'),
      time: '5:00 PM - 8:00 PM',
      location: 'Innovation Hub',
      status: 'Active',
      organiser: admin._id,
    },
    {
      title: 'Women in Business Forum',
      category: 'Business',
      date: new Date('2026-04-02'),
      time: '10:00 AM - 2:00 PM',
      location: 'Masa Square',
      status: 'Active',
      organiser: admin._id,
    },
    {
      title: 'Live Music Night',
      category: 'Music',
      date: new Date('2026-03-30'),
      time: '7:00 PM - 10:00 PM',
      location: 'Gaborone Club',
      status: 'Upcoming',
      organiser: admin._id,
    },
    {
      title: 'Developer Meetup',
      category: 'Technology',
      date: new Date('2026-04-10'),
      time: '6:00 PM - 9:00 PM',
      location: 'Botswana Innovation Hub',
      status: 'Upcoming',
      organiser: admin._id,
    },
  ]);

  console.log('Created events:', events.map(e => e.title));

  // Create demo attendees and bookings spread across months
  const months = [0, 1, 2, 3, 4, 5]; // Jan - Jun
  let bookingCount = 0;

  for (const event of events) {
    const attendeeCount = Math.floor(Math.random() * 100) + 50;

    for (let i = 0; i < attendeeCount; i++) {
      const attendee = await User.create({
        firstName: `User`,
        lastName: `${bookingCount}`,
        email: `user${bookingCount}@demo.com`,
        password: await bcrypt.hash('password123', 10),
        role: 'user',
        qrCode: uuidv4(),
      });

      const month = months[Math.floor(Math.random() * months.length)];
      const bookingDate = new Date(2026, month, Math.floor(Math.random() * 28) + 1);

      // 80% chance of being scanned (checked in)
      const wasScanned = Math.random() < 0.8;

      await Booking.create({
        user: attendee._id,
        event: event._id,
        status: 'confirmed',
        createdAt: bookingDate,
        scannedAt: wasScanned ? bookingDate : undefined,
      });

      bookingCount++;
    }
  }

  console.log(`Created ${bookingCount} bookings`);
  console.log('\n✅ Seed complete!');
  console.log('Login with: demo@eventhub.com / password123');

  mongoose.disconnect();
};

seed().catch((err) => {
  console.error(err);
  mongoose.disconnect();
});