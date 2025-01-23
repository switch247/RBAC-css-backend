const jwt = require('jsonwebtoken');
const logger = require('../config/logger');
const AuthService = require('../services/AuthService');

class AuthMiddleware {
  static async authenticate(req, res, next) {
    console.log(req.headers)
    const token = req.headers['authorization'];
    if (!token) {
      logger.warn('Authorization token is missing');
      return res.status(403).send('Token is required');
    }

    try {
      const decoded = AuthService.verifyToken(token);
      console.log('Decoded token:', decoded);
      req.userId = decoded.id;
      req.userRole = decoded.role; // Ensure to add role in the token
      req.user = { id: decoded.id, role: decoded.role };
      next();
    } catch (error) {
      console.log(error.message);
      logger.error('Invalid token');
      return res.status(401).send(`Invalid Token ${error}`);
    }
  }
  static authorize( roles =[]) {
    //
    return (req, res, next) => {
      const { role } = req.user;
      console.log(roles, role)
      if (!roles.includes(role)) {
        logger.warn(`User role ${role} is not authorized to access this resource`);
        return res.status(403).json({ message: 'Forbidden' });
      }
      next();
    };
  }
}

module.exports = AuthMiddleware;
