const { scheduleBackupJob } = require('./backupJob');
const { scheduleUnlockJob } = require('./unlockUsersJob');

/**
 * Start all cron jobs.
 */
const startJobs = () => {
  console.log('Starting cron jobs...');
  scheduleBackupJob();
  scheduleUnlockJob();
};

module.exports = { startJobs };