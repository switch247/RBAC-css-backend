const prisma = require('../database/dbClient');
const logger = require('../config/logger');

class UserService {
  // Create a new user
  static async createUser({ username, password, email, roles }) {
    try {
      const newUser = await prisma.user.create({
        data: {
          username,
          password, // Ensure to hash the password before saving
          email,
          roles: {
            connect: roles.map(roleId => ({ id: roleId })),
          },
        },
      });
      logger.info(`User created: ${newUser.username}`);
      return newUser;
    } catch (error) {
      logger.error(`Error creating user: ${error.message}`);
      throw new Error('Error creating user');
    }
  }

  // Read all users
  static async getAllUsers() {
    try {
      const users = await prisma.user.findMany({
        include: { roles: true }, // Include roles in the response
      });
      logger.info('Fetched all users successfully');
      return users;
    } catch (error) {
      logger.error(`Error fetching users: ${error.message}`);
      throw new Error('Error fetching users');
    }
  }

  // Read a single user by ID
  static async getUserById(id) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: { roles: true },
      });
      if (!user) {
        throw new Error('User not found');
      }
      logger.info(`Fetched user: ${user.username}`);
      return user;
    } catch (error) {
      logger.error(`Error fetching user: ${error.message}`);
      throw new Error('Error fetching user');
    }
  }

  // Update user details
  static async updateUser(id, data) {
    try {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          ...data,
          roles: {
            set: data.roles.map(roleId => ({ id: roleId })),
          },
        },
      });
      logger.info(`User updated: ${updatedUser.username}`);
      return updatedUser;
    } catch (error) {
      logger.error(`Error updating user: ${error.message}`);
      throw new Error('Error updating user');
    }
  }

  // Delete a user
  static async deleteUser(id) {
    try {
      const deletedUser = await prisma.user.delete({
        where: { id },
      });
      logger.info(`User deleted: ${deletedUser.username}`);
      return deletedUser;
    } catch (error) {
      logger.error(`Error deleting user: ${error.message}`);
      throw new Error('Error deleting user');
    }
  }
}

module.exports = UserService;