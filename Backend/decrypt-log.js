const fs = require('fs');
const crypto = require('crypto');

const algorithm = 'aes-256-ctr';

const const_secretKey = "08e6d407accd8da8bed6db1f4c486ad5e1b6f41a60cb1efc2ee11b6cce3b363b"
const const_iv = "d90d56d01bf526fabd333153573601d6"

const secretKey = Buffer.from(const_secretKey, 'hex'); // Replace with your secret key
const iv = Buffer.from(const_iv, 'hex'); // Replace with your IV

const decrypt = (encryptedText) => {
  const [ivHex, encrypted] = encryptedText.split(':');
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(ivHex, 'hex')
  );
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};


// Read the encrypted log file
const encryptedLogs = fs.readFileSync('combined.log', 'utf8').split('\n');

// Decrypt each log entry
encryptedLogs.forEach((encryptedLog) => {
  if (encryptedLog.trim()) {
    const decryptedLog = decrypt(encryptedLog);
    console.log(JSON.parse(decryptedLog));
  }
});
console.log(encryptedLogs);
console.log('first');
