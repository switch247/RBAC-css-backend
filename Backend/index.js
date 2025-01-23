const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const AuthMiddleware = require('./middlewares/AuthMiddleware');
const ipLoggerMiddleware = require('./middlewares/ipLoggerMiddleware');
const path = require('path');
const { startJobs } = require('./jobs');

require('dotenv').config();

const app = express();

// Start cron jobs
startJobs();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(ipLoggerMiddleware);

// Enhanced CORS Middleware
app.use((req, res, next) => {
  // Allow requests from all origins (or specify specific origins)
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Allow specific HTTP methods
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );

  // Allow specific headers
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Allow credentials (if needed)
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204); // No content for preflight requests
  }

  next();
});
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(bodyParser.json());

const apiRoutes = express.Router();

apiRoutes.use('/auth', authRoutes);

apiRoutes.use('/users', AuthMiddleware.authenticate, userRoutes);

app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
