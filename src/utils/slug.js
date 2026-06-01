const reservedUsernames = new Set(["api", "api-docs", "docs", "health", "admin"]);

function sanitizeSlug(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function isReservedUsername(username) {
  return reservedUsernames.has(username);
}

function randomSlug(length = 7) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let index = 0; index < length; index += 1) {
    result += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return result;
}

module.exports = {
  isReservedUsername,
  randomSlug,
  sanitizeSlug,
};
