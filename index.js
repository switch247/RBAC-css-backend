const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const AuthMiddleware = require('./middlewares/isAuthenticated');

require('dotenv').config();

const path = require('path');
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));


const app = express();
app.use(bodyParser.json());

const apiRoutes = express.Router();

apiRoutes.use('/auth', authRoutes);

apiRoutes.use(
  '/users',
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize[('User', 'Admin')],
  userRoutes
);


app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
