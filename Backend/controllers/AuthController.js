const logger = require('../config/logger');
const prisma = require('../database/dbClient');
const MessageService = require('../services/MessageService');
const AuthService = require('../services/AuthService');
const {
  PrismaClientKnownRequestError,
} = require('@prisma/client/runtime/library');
const { handlePrismaError } = require('../utils/prismaErrorHandler');

class AuthController {
  static async register(req, res) {
    try {
      const { username, phoneNumber, email, password } = req.body;

      if (!AuthService.validatePassword(password)) {
        logger.error('Password validation failed');

        return res.status(400).json({
          message:
            'Password must be at least 8 characters long and include one letter, one number, and one special character.',
        });
      }

      const hashedPassword = await AuthService.hashPassword(password);

      // validate the payload
      if (!username || !email || !phoneNumber) {
        logger.error(
          'Missing required fields: username, email, or phoneNumber'
        );
        return res
          .status(400)
          .json({ message: 'Username, email, and phone number are required.' });
      }

      const user = await prisma.user.create({
        data: { username, email, phoneNumber, password: hashedPassword },
      });
      delete user.password;
      logger.info(`User registered: ${user.username}`);
      res.status(201).json({ message: 'User registered successfully.', user });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        var errorMessage = handlePrismaError(error); // Reuse the error handler
        logger.error(`Prisma error (code: ${error.code}): ${errorMessage}`);
        return res.status(400).json({ message: errorMessage });
      }
      logger.error(`Registration error: ${error.message}`);
      res.status(400).json({ message: error.message });
    }
  }

  // , process.env.JWT_SECRET
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.isLocked) {
        return res.status(403).json({
          message: 'Account is locked due to multiple failed login attempts.',
        });
      }

      const isPasswordValid = await AuthService.comparePassword(
        password,
        user.password
      );

      if (!isPasswordValid) {
        await prisma.user.update({
          where: { id: user.id },
          data: { failedAttempts: user.failedAttempts + 1 },
        });

        if (user.failedAttempts + 1 >= 5) {
          await prisma.user.update({
            where: { id: user.id },
            data: { isLocked: true },
          });
          return res.status(403).json({ message: 'Account is now locked.' });
        }

        return res.status(400).json({ message: 'Invalid credentials' });
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { failedAttempts: 0 },
      });

      // Generate JWT token
      const token = AuthService.generateToken({
        id: user.id,
        role: user.role,
        expires: 60 * 60, // Token expires in 1 hour
      });
      // Math.floor(Date.now() / 1000) +

      delete user.password;
      logger.info(`User logged in: ${req.body.username}`);
      res.status(200).json({ message: 'Login successful', token, user });
    } catch (error) {
      console.log(error);

      if (error instanceof PrismaClientKnownRequestError) {
        var errorMessage = handlePrismaError(error); // Reuse the error handler
        logger.error(`Prisma error (code: ${error.code}): ${errorMessage}`);
        return res.status(400).json({ message: errorMessage });
      }
      logger.error(`Login error: ${error.message}`);
      res.status(401).json({ message: error.message });
    }
  }

  //  Get User Details
  static async me(req, res) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: Number(req.userId) },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      logger.info(`User details retrieved: ${user.email}`);
      const { password, ...user_no_pass } = user;
      res.status(200).json({ ...user_no_pass });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        var errorMessage = handlePrismaError(error); // Reuse the error handler
        logger.error(`Prisma error (code: ${error.code}): ${errorMessage}`);
        return res.status(400).json({ message: errorMessage });
      }
      logger.error(`Me error: ${error.message}`);
      res.status(400).json({ message: error.message });
    }
  }

  //   Change Password
  static async changePassword(req, res) {
    try {
      const { email, oldPassword, newPassword } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isOldPasswordValid = await AuthService.comparePassword(
        oldPassword,
        user.password
      );

      if (!isOldPasswordValid) {
        return res.status(400).json({ message: 'Old password is incorrect' });
      }

      if (!AuthService.validatePassword(newPassword)) {
        return res.status(400).json({
          message:
            'New password must be at least 8 characters long and include one letter, one number, and one special character.',
        });
      }

      const hashedNewPassword = await AuthService.hashPassword(newPassword);

      await prisma.user.update({
        where: { id: Number(user.id) },
        data: { password: hashedNewPassword },
      });

      logger.info(`Password changed for user: ${user.email}`);
      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        var errorMessage = handlePrismaError(error); // Reuse the error handler
        logger.error(`Prisma error (code: ${error.code}): ${errorMessage}`);
        return res.status(400).json({ message: errorMessage });
      }
      logger.error(`Change password error: ${error.message}`);
      res.status(400).json({ message: error.message });
    }
  }

  //   Multi Factor Authentication Using OTP
  static async sendOtp(req, res) {
    try {
      const { phoneNumber } = req.body;
      console.log('send otp pressed', phoneNumber);
      const user = await prisma.user.findUnique({ where: { phoneNumber } });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Send OTP to user's email (implementation depends on your email service)
      await MessageService.sendOtp(phoneNumber);

      logger.info(`OTP sent to user: ${user.phoneNumber}`);
      res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
      logger.error(`Send OTP error: ${error.message}`);
      res.status(400).json({ message: error.message });
    }
  }

  static async verifyOtp(req, res) {
    try {
      const { phoneNumber, otp, verificationId } = req.body;

      await MessageService.verifyOtp(phoneNumber, otp, verificationId);

      const user = await prisma.user.findUnique({ where: { phoneNumber } });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.isLocked) {
        return res.status(403).json({
          message: 'Account is locked due to multiple failed login attempts.',
        });
      }

      const token = AuthService.generateToken({
        id: user.id,
        role: user.role,
        expires: 60 * 60 * 40, // Token expires in 40 hour
      });
      logger.info(`OTP verified for user: ${user.username}`);
      delete user.password;
      res.status(200).json({ message: 'Login successful', token, user });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        var errorMessage = handlePrismaError(error); // Reuse the error handler
        logger.error(`Prisma error (code: ${error.code}): ${errorMessage}`);
        return res.status(400).json({ message: errorMessage });
      }
      logger.error(`Verify OTP error: ${error.message}`);
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = AuthController;
