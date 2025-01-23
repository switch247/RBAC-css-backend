const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const logger = require('../config/logger');
require('dotenv').config();

// Extract the database file path from DATABASE_URL
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in the environment variables.');
}

// Extract the file path from the URL (e.g., "file:./dev.db" => "./dev.db")
const DB_FILE_RELATIVE_PATH = DATABASE_URL.replace('file:', '');

// Resolve the absolute path to the database file
const DB_FILE = path.join(__dirname, '../database/prisma', DB_FILE_RELATIVE_PATH);

// Configuration
const BACKUP_DIR = path.join(__dirname, '../backups'); // Directory where backups will be stored

// Ensure the backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

/**
 * Perform a database backup.
 */
const backupDatabase = () => {
  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
  const backupFileName = path.join(BACKUP_DIR, `backup_${timestamp}.db`);

  try {
    // Copy the SQLite database file to the backup location
    fs.copyFileSync(DB_FILE, backupFileName);
    logger.info(`Backup successful: ${backupFileName}`);
  } catch (error) {
    logger.error(`Backup failed: ${error.message}`);
  }
};

/**
 * Schedule the database backup job.
 */
const scheduleBackupJob = () => {
  // Schedule the backup job to run daily at 2 AM
  cron.schedule('0 2 * * *', () => {
    logger.info('Starting daily database backup...');
    backupDatabase();
  });
};

module.exports = { scheduleBackupJob };