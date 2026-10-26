const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const { requireJsonContentType, notFoundHandler } = require('./middleware/validators');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');

// P10: Load event listeners
require('./events/listeners');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/taskdb';

// Connect to MongoDB (Practical 5)
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

// Global middleware pipeline
app.use(cors());
app.use(express.json());
app.use(logger);
app.use(requireJsonContentType);

// Resource routes
app.use('/tasks', taskRoutes);
app.use('/auth', authRoutes);
app.use('/api/ai', aiRoutes);

// Undefined route & error handling
app.use(notFoundHandler);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
