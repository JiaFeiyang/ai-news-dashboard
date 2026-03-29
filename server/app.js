const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config();

// Import configuration
const config = require('./config');

// Import utilities
const scheduler = require('./utils/scheduler');

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Import routes
const socialContentRoutes = require('./routes/socialContent');
const agentUpdatesRoutes = require('./routes/agentUpdates');

// Routes
app.use('/api/social-content', socialContentRoutes);
app.use('/api/agent-updates', agentUpdatesRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');

  // Initialize scheduled tasks after database connection
  initializeScheduledTasks();

  const PORT = process.env.PORT || config.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
})
.catch(err => {
  console.error('Database connection error:', err);
});

/**
 * Initialize scheduled tasks for the application
 */
function initializeScheduledTasks() {
  console.log('Initializing scheduled tasks...');

  // Example task: Health check logging
  scheduler.scheduleTask('health-check-logger', async () => {
    console.log(`Health check at ${new Date().toISOString()}: Server running normally`);
  }, 300000); // Every 5 minutes

  console.log('Scheduled tasks initialized');
}

module.exports = app;