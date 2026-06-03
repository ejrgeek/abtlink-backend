const logger = {
  error: (message, error) => {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, error);
  },
  info: (message) => {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`);
  },
};

module.exports = logger;
