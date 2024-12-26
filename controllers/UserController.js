
const logger = require('../config/logger');
const prisma = require('../config/dbConfig');

class UserController {

  static async getUsers(req, res) {
    try {
      const users = await prisma.users.findMany();
      logger.info('Fetched all users');
      res.json(users);
    } catch (error) {
      logger.error(`Error fetching users: ${error.message}`);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await prisma.users.findUnique({ where: { id: Number(id) } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      logger.info(`Fetched user with id: ${id}`);
      res.json(user);
    } catch (error) {
      logger.error(`Error fetching user: ${error.message}`);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async createUser(req, res) {
    try {
      const { name, email, password } = req.body;
      const newUser = await prisma.users.create({
        data: { name, email, password },
      });
      logger.info('Created new user');
      res.status(201).json(newUser);
    } catch (error) {
      logger.error(`Error creating user: ${error.message}`);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, email, phoneNumber } = req.body;
      const { userId, userRole } = req;
      if (userRole !== 'ADMIN' ||   userRole === 'USER' && userId  && userId !== id ) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      const updatedUser = await prisma.users.update({
        where: { id: id},
        data: { name, email, phoneNumber },
      });
      logger.info(`Updated user with id: ${id}`);
      res.json(updatedUser);
    } catch (error) {
      logger.error(`Error updating user: ${error.message}`);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      await prisma.users.delete({ where: { id: Number(id) } });
      logger.info(`Deleted user with id: ${id}`);
      res.status(204).send();
    } catch (error) {
      logger.error(`Error deleting user: ${error.message}`);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async updateUserRoles(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const actorId = req.userId;
      // Fetch the current user to get the old role
      const currentUser = await prisma.users.findUnique({ where: { id: id } });
      if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
      }

      // Update the user's role
      const updatedUser = await prisma.users.update({
      where: { id: id },
      data: { role },
      });

      // Log the role change in RoleAudit
      await prisma.roleAudit.create({
      data: {
        userId: id,
        actorId: actorId,
        oldRole: currentUser.role,
        newRole: role,
      },
      });

      logger.info(`Updated roles for user with id: ${id}`);
      res.json(updatedUser);
    } catch (error) {
      logger.error(`Error updating user roles: ${error.message}`);
      res.status(500).json({ message: 'Internal server error' });
    }
    }


}

module.exports = UserController;