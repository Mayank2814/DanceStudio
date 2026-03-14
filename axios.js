const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Load environment variables
dotenv.config();

// Connect to database and run dev-only seeders
(async function init() {
  await connectDB();

  // Seed demo users in development for convenience
  if (process.env.NODE_ENV !== 'production') {
    try {
      const User = require('./models/User');

      const seedIfMissing = async (email, role, name) => {
        const exists = await User.findOne({ email });
        if (!exists) {
          await User.create({ name, email, password: 'password123', role });
          console.log(`Seeded demo user: ${email}`);
        }
      };

      await seedIfMissing('user@test.com', 'user', 'Demo User');
      await seedIfMissing('admin@test.com', 'admin', 'Admin User');
    } catch (err) {
      console.error('Seeding demo users failed:', err);
    }
  }
})();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/classes', require('./routes/classes'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/attendance', require('./routes/attendance'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Dance Platform API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;
