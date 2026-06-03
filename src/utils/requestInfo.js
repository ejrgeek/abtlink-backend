const crypto = require("crypto");

function hashIp(ip) {
  if (!ip) {
    return null;
  }

  return crypto.createHash("sha256").update(ip).digest("hex");
}

function getRequestInfo(req) {
  return {
    ipHash: hashIp(req.ip || req.headers["x-forwarded-for"]),
    userAgent: req.headers["user-agent"] || null,
    referer: req.headers.referer || req.headers.referrer || null,
  };
}

module.exports = {
  getRequestInfo,
};
