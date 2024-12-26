const winston = require('winston');
const crypto = require('crypto');
const fs = require('fs');

const algorithm = 'aes-256-ctr';
const secretKey = 'secret-key-for logger';

const encrypt = (text) => {
  const cipher = crypto.createCipher(algorithm, secretKey);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

class EncryptedFileTransport extends winston.transports.File {
  log(info, callback) {
    setImmediate(() => this.emit('logged', info));

    const encryptedMessage = encrypt(JSON.stringify(info));
    fs.appendFile(this.filename, encryptedMessage + '\n', callback);
  }
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new EncryptedFileTransport({ filename: 'logs/error.log', level: 'error' }),
    new EncryptedFileTransport({ filename: 'logs/combined.log' })
  ],
});

module.exports = logger;