const env = require("../config/env");

function errorMiddleware(err, req, res, next) {
  const statusCode = err.statusCode || err.status || 500;
  const response = {
    message: statusCode >= 500 ? "Erro interno do servidor." : err.message,
  };

  if (err.details) {
    response.details = err.details;
  }

  if (env.nodeEnv !== "production") {
    response.debug = err.message;
  }

  res.status(statusCode).json(response);
}

module.exports = errorMiddleware;
