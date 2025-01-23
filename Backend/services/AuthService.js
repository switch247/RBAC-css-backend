const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const secretKey = process.env.JWT_SECRET || 't';
class AuthService {
  // constructor(prisma) {
  //     this.prisma = prisma;
  // }
  static validatePassword(password) {
    console.log(password);
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  }

  static generateToken(payload) {
    // payload,
    return jwt.sign({ ...payload }, secretKey, {
      expiresIn: payload.expires ?? '1h',
    });
  }

  static verifyToken(token) {
    console.log('token:', token);
    if (token.startsWith('Bearer ')) {
      token = token.split(' ')[1];
    }
    return jwt.verify(token, secretKey);
  }

  static decodeToken(token) {
    return jwt.decode(token);
  }

  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = AuthService;
