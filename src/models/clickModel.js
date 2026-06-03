const prisma = require("../config/prisma");

function createClick(data) {
  return prisma.linkClick.create({
    data: {
      linkId: data.linkId,
      userId: data.userId,
      ipHash: data.ipHash,
      userAgent: data.userAgent,
      referer: data.referer,
      country: data.country,
      city: data.city,
    },
  });
}

module.exports = {
  createClick,
};
