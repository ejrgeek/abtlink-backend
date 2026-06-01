const prisma = require("../config/prisma");

const linkInclude = {
  qrCode: true,
};

function createLink(data) {
  return prisma.link.create({
    data: {
      userId: data.userId,
      originalUrl: data.originalUrl,
      domain: data.domain,
      slug: data.slug,
      shortUrl: data.shortUrl,
      title: data.title,
      description: data.description,
      qrCode: data.qrCodeBase64
        ? {
            create: {
              imageBase64: data.qrCodeBase64,
            },
          }
        : undefined,
    },
    include: linkInclude,
  });
}

function findByUserAndSlug(userId, slug) {
  return prisma.link.findFirst({
    where: {
      userId,
      slug,
      deletedAt: null,
    },
  });
}

function findByUsernameAndSlug(username, slug) {
  return prisma.link.findFirst({
    where: {
      slug,
      deletedAt: null,
      status: "ACTIVE",
      user: {
        username,
        deletedAt: null,
        isActive: true,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
      qrCode: true,
    },
  });
}

function listByUser(userId) {
  return prisma.link.findMany({
    where: {
      userId,
      deletedAt: null,
    },
    include: linkInclude,
    orderBy: {
      createdAt: "desc",
    },
  });
}

function incrementClickCount(id) {
  return prisma.link.update({
    where: { id },
    data: {
      clickCount: {
        increment: 1,
      },
    },
  });
}

module.exports = {
  createLink,
  findByUserAndSlug,
  findByUsernameAndSlug,
  incrementClickCount,
  listByUser,
};
