const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

class AuthMiddleware {
  static async authenticate(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
      logger.warn('Authorization token is missing');
      return res.status(403).send('Token is required');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
      req.userRole = decoded.role; // Ensure to add role in the token
      next();
    } catch (error) {
      logger.error('Invalid token');
      return res.status(401).send('Invalid Token');
    }
  }
  static authorize(roles = []) {
    return (req, res, next) => {
      const { role } = req.user;
      if (!roles.includes(role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      next();
    };
  }
}

module.exports = AuthMiddleware;
