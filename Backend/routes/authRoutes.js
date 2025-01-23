const express = require('express');
const AuthController = require('../controllers/AuthController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');

const router = express.Router();

router.post('/register', AuthController.register);

router.post('/login', AuthController.login);

router.get('/me', AuthMiddleware.authenticate, AuthController.me);

router.post('/change-password', AuthMiddleware.authenticate, AuthController.changePassword);

// MFA
router.post('/send-otp', AuthController.sendOtp);

router.post('/otp-login', AuthController.verifyOtp);

module.exports = router;