const AuthService = require('../services/AuthService');
const logger = require('../config/logger');
const prisma = require('../config/dbConfig');
const MessageService = require('../services/MessageService');

class AuthController {
  
  static async register(req, res) {
    try {
      const { email, password, role } = req.body;

      if (!AuthService.validatePassword(password)) {
        logger.error('Password validation failed');

        return res.status(400).json({
          message:
            'Password must be at least 8 characters long and include one letter, one number, and one special character.',
        });
      }

      const hashedPassword = await AuthService.hashPassword(password);

      const user = await prisma.user.create({
        data: { email, password: hashedPassword, role },
      });

      logger.info(`User registered: ${user.username}`);
      res.status(201).json({ message: 'User registered successfully.', user });
    } catch (error) {
      logger.error(`Registration error: ${error.message}`);
      res.status(400).json({ message: error.message });
    }
  }

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

      const isPasswordValid = await AuthService.compare(
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

      const token = AuthService.generateToken(user);

      logger.info(`User logged in: ${req.body.username}`);
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      logger.error(`Login error: ${error.message}`);
      res.status(401).json({ message: error.message });
    }
  }

  //  Get User Details
  static async me(req, res) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: { id: true, email: true, role: true , phoneNumber: true, createdAt: true, updatedAt: true },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      logger.info(`User details retrieved: ${user.email}`);
      res.status(200).json({ user });
    }
    catch (error) {
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

      const isOldPasswordValid = await AuthService.compare(
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
        where: { id: user.id },
        data: { password: hashedNewPassword },
      });

      logger.info(`Password changed for user: ${user.email}`);
      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      logger.error(`Change password error: ${error.message}`);
      res.status(400).json({ message: error.message });
    }
  }

  //   Multi Factor Authentication Using OTP

  static async sendOtp(req, res) {
    try {
      const { phoneNumber } = req.body;
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

      const token = AuthService.generateToken(user);
      logger.info(`OTP verified for user: ${user.username}`);
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      logger.error(`Verify OTP error: ${error.message}`);
      res.status(400).json({ message: error.message });
    }
  }

}

module.exports = AuthController;
