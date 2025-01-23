const logger = require('../config/logger');
const prisma = require('../database/dbClient');

const {
  PrismaClientKnownRequestError,
} = require('@prisma/client/runtime/library');
const { handlePrismaError } = require('../utils/prismaErrorHandler');

const AuthService = require('../services/AuthService');

class UserController {
  static async getUsers(req, res) {
    try {
      const userIp =
        req.connection.remoteAddress ||
        req.ip ||
        req.headers['x-forwarded-for'];
      const userAgent = req.get('User-Agent');
      const userId = req.userId || 'Guest';

      logger.info(
        `Fetched all users - IP: ${userIp}, Browser: ${userAgent}, User: ${userId}`
      );
      const users = await prisma.user.findMany();
      res.json(users);
    } catch (error) {
      console.log(error);
      if (error instanceof PrismaClientKnownRequestError) {
        var errorMessage = handlePrismaError(error); // Reuse the error handler
        logger.error(`Prisma error (code: ${error.code}): ${errorMessage}`);
        return res.status(400).json({ message: errorMessage });
      }
      logger.error(`Error fetching users: ${error.message}`);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
        include: {
          RoleHistory: true,
        },
      });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      logger.info(`Fetched user with id: ${id}`);
      res.json(user);
    } catch (error) {
      logger.error(`Error fetching user: ${error.message}`);
      if (error instanceof PrismaClientKnownRequestError) {
        var errorMessage = handlePrismaError(error); // Reuse the error handler
        logger.error(`Prisma error (code: ${error.code}): ${errorMessage}`);
        return res.status(400).json({ message: errorMessage });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async createUser(req, res) {
    try {
      const { username, email, password, phoneNumber, role } = req.body;

      if (!AuthService.validatePassword(password)) {
        logger.error('Password validation failed');

        return res.status(400).json({
          message:
            'Password must be at least 8 characters long and include one letter, one number, and one special character.',
        });
      }

      // validate the payload
      if (!username || !email || !phoneNumber) {
        logger.error(
          'Missing required fields: username, email, or phoneNumber'
        );
        return res
          .status(400)
          .json({ message: 'Username, email, and phone number are required.' });
      }
      const hashedPassword = await AuthService.hashPassword(password);
      const newUser = await prisma.user.create({
        data: { username, email, password: hashedPassword, phoneNumber, role },
      });

      logger.info('Created new user');
      res.status(201).json(newUser);
    } catch (error) {
      logger.error(`Error creating user: ${error.message}`);
      if (error instanceof PrismaClientKnownRequestError) {
        var errorMessage = handlePrismaError(error); // Reuse the error handler
        logger.error(`Prisma error (code: ${error.code}): ${errorMessage}`);
        return res.status(400).json({ message: errorMessage });
      }
      res
        .status(500)
        .json({ message: `Internal server error  ${error.message}` });
    }
  }

  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { username, email, phoneNumber, isVerified } = req.body;
      const { userId, userRole } = req;
      if (!userId || (userRole === 'USER' && userId !== id)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      const updatedUser = await prisma.user.update({
        where: { id: Number(id) },
        data: { username, email, phoneNumber, isVerified },
      });
      logger.info(`Updated user with id: ${id}`);
      res.json(updatedUser);
    } catch (error) {
      console.log(error);
      logger.error(`Error updating user: ${error.message}`);
      if (error instanceof PrismaClientKnownRequestError) {
        var errorMessage = handlePrismaError(error); // Reuse the error handler
        logger.error(`Prisma error (code: ${error.code}): ${errorMessage}`);
        return res.status(400).json({ message: errorMessage });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      await prisma.user.delete({ where: { id: Number(id) } });
      logger.info(`Deleted user with id: ${id}`);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      logger.error(`Error deleting user: ${error.message}`);
      if (error instanceof PrismaClientKnownRequestError) {
        var errorMessage = handlePrismaError(error); // Reuse the error handler
        logger.error(`Prisma error (code: ${error.code}): ${errorMessage}`);
        return res.status(400).json({ message: errorMessage });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async updateUserRoles(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const actorId = req.userId;
      // Fetch the current user to get the old role
      const currentUser = await prisma.user.findUnique({
        where: { id: Number(id) },
      });
      if (!currentUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update the user's role
      const updatedUser = await prisma.user.update({
        where: { id: Number(id) },
        data: { role },
      });

      // Log the role change in RoleAudit
      await prisma.roleAudit.create({
        data: {
          userId: Number(id),
          actorId: Number(actorId),
          oldRole: currentUser.role,
          newRole: role,
        },
      });

      logger.info(`Updated roles for user with id: ${id}`);
      res.json(updatedUser);
    } catch (error) {
      logger.error(`Error updating user roles: ${error.message}`);
      if (error instanceof PrismaClientKnownRequestError) {
        var errorMessage = handlePrismaError(error); // Reuse the error handler
        logger.error(`Prisma error (code: ${error.code}): ${errorMessage}`);
        return res.status(400).json({ message: errorMessage });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = UserController;
