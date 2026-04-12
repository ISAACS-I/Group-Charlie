require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

connectDB();

// Simple CORS - allow all for debugging
app.use(cors({
  origin: '*',
  methods: '*',
  allowedHeaders: '*'
}));

app.use(express.json());

const paymentRoutes = require("./routes/payments");

app.use("/api", paymentRoutes);

const PORT = process.env.PORT || 5000;
// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/analytics', require('./routes/analytics'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));