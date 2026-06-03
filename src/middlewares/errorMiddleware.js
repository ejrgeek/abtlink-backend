const logger = require("../utils/logger");

function errorMiddleware(err, req, res, next) {
  logger.error("Unhandled error:", err);
  
  const statusCode = err.statusCode || err.status || 500;
  
  res.status(statusCode).json({
    message: statusCode >= 500 ? "Internal Server Error" : err.message,
  });
}

module.exports = errorMiddleware;
