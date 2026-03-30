require('dotenv').config();
const mongoose = require('mongoose');

const setup = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  // USERS
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  await db.collection('users').createIndex({ phone_number: 1 }, { unique: true, sparse: true });

  // EVENTS
  await db.collection('events').createIndex({ location_coords: '2dsphere' });
  await db.collection('events').createIndex({ status: 1, start_time: 1 });
  await db.collection('events').createIndex({ category_id: 1 });
  await db.collection('events').createIndex({ host_id: 1 });

  // BOOKINGS
  await db.collection('bookings').createIndex({ user_id: 1, status: 1 });
  await db.collection('bookings').createIndex({ event_id: 1 });

  // TICKETS
  await db.collection('tickets').createIndex({ event_id: 1, status: 1 });
  await db.collection('tickets').createIndex({ booking_item_id: 1 });

  // TICKET TYPES
  await db.collection('tickettypes').createIndex({ event_id: 1 });

  console.log('All indexes created successfully');
  process.exit(0);
};

setup().catch(err => { console.error(err); process.exit(1); });