const winston = require('winston');
const crypto = require('crypto');
const fs = require('fs');

// Encryption configuration
const algorithm = 'aes-256-ctr';
// const secretKey = crypto.randomBytes(32); // 32 bytes for AES-256
// const iv = crypto.randomBytes(16); // 16 bytes for AES

const const_secretKey =
  '08e6d407accd8da8bed6db1f4c486ad5e1b6f41a60cb1efc2ee11b6cce3b363b';
const const_iv = 'd90d56d01bf526fabd333153573601d6';

const secretKey = Buffer.from(const_secretKey, 'hex'); // Replace with your secret key
const iv = Buffer.from(const_iv, 'hex'); // Replace with your IV

console.log(`Secret Key: ${secretKey.toString('hex')}`);
console.log(`IV: ${iv.toString('hex')}`);

// Encrypt function
const encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`; // Include IV for decryption
};

// Custom transport for encrypted logs
class EncryptedFileTransport extends winston.transports.File {
  log(info, callback) {
    setImmediate(() => this.emit('logged', info));

    const encryptedMessage = encrypt(JSON.stringify(info));
    fs.appendFile(this.filename, encryptedMessage + '\n', callback);
  }
}

// Logger configuration
const logger = winston.createLogger({
  level: 'info', // Default log level
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Log to console (unencrypted)
    new winston.transports.Console(),

    // Log errors to an encrypted file
    new EncryptedFileTransport({ filename: 'logs/error.log', level: 'error' }),

    // Log all levels to an encrypted file
    new EncryptedFileTransport({ filename: 'logs/combined.log' }),
  ],
});

module.exports = logger;
