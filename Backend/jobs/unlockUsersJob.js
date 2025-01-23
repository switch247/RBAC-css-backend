const cron = require('node-cron');
const logger = require('../config/logger');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Unlock users who have been locked for more than an hour.
 */
const unlockUsers = async () => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  try {
    const users = await prisma.user.findMany({
      where: {
        isLocked: true,
        updatedAt: {
          lt: oneHourAgo,
        },
      },
    });

    for (const user of users) {
      await prisma.user.update({
        where: { id: user.id },
        data: { isLocked: false },
      });
      logger.info(`Unlocked user: ${user.username}`);
    }
  } catch (error) {
    logger.error(`Error unlocking users: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
};

/**
 * Schedule the user unlock job.
 */
const scheduleUnlockJob = () => {
  // Schedule the unlock job to run every hour
  cron.schedule('0 * * * *', () => {
    logger.info('Starting user unlock job...');
    unlockUsers();
  });
};

module.exports = { scheduleUnlockJob };
