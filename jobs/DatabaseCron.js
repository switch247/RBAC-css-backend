const cron = require('node-cron');
const { exec } = require('child_process');
const logger = require('../config/logger');
const { PrismaClient } = require('@prisma/client');

require('dotenv').config();


const BACKUP_DIR = './backups'; // Directory where backups will be stored
const DB_NAME = process.env.DB_NAME || 'secureaccess';
const DB_USER = process.env.DB_USER || 'user';
const DB_PASSWORD = process.env.DB_PASSWORD || 'password';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '5432';

// Function to perform the database backup
const backupDatabase = () => {
  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
  const backupFileName = `${BACKUP_DIR}/${DB_NAME}_${timestamp}.sql`;

  const command = `PGPASSWORD=${DB_PASSWORD} pg_dump -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} ${DB_NAME} > ${backupFileName}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      logger.error(`Backup failed: ${stderr}`);
      return;
    }
    logger.info(`Backup successful: ${backupFileName}`);
  });
};

// Schedule the backup job to run daily at 2 AM
cron.schedule('0 2 * * *', () => {
  logger.info('Starting daily database backup...');
  backupDatabase();
});







const prisma = new PrismaClient();

// cron job to unlock users that have been locked for more than an hour
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

// Schedule the unlock job to run every hour
cron.schedule('0 * * * *', () => {
  logger.info('Starting user unlock job...');
  unlockUsers();
});