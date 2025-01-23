const logger = require('../config/logger');

const ipLoggerMiddleware = (req, res, next) => {
  logger.debug('ipLoggerMiddleware called'); // Debug log

  if (!req) {
    logger.error('Request object is undefined in ipLoggerMiddleware');
    return next(new Error('Request object is undefined'));
  }

  // Capture additional information using .get()
  const userIp =
    req.get('x-forwarded-for') ||
    req.get('X-Forwarded-For') ||
    req.socket?.remoteAddress ||
    req.connection?.remoteAddress ||
    req.ip ||
    'Unknown IP';

  const userAgent = req.get('User-Agent') || 'Unknown User-Agent';
  const method = req.method || 'Unknown Method';
  const url = req.originalUrl || req.url || 'Unknown URL';

  // Log the request with all relevant information
  logger.info(
    `Request received from IP: ${userIp}, Browser: ${userAgent}, Method: ${method}, URL: ${url}`
  );

  next();
};

module.exports = ipLoggerMiddleware;