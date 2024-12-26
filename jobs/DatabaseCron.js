const cron = require('node-cron');
const { exec } = require('child_process');
const logger = require('../config/logger');
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