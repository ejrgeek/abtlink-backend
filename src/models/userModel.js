const prisma = require("../config/prisma");

const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  username: true,
  role: true,
  emailVerifiedAt: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

function findByEmailOrUsername(email, username) {
  return prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
      deletedAt: null,
    },
  });
}

function findByEmailWithPassword(email) {
  return prisma.user.findFirst({
    where: {
      email,
      deletedAt: null,
    },
    select: {
      ...safeUserSelect,
      passwordHash: true,
    },
  });
}

function findById(id) {
  return prisma.user.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    select: safeUserSelect,
  });
}

function createCustomer(data) {
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      username: data.username,
      passwordHash: data.passwordHash,
      role: "CUSTOMER",
      preference: {
        create: {},
      },
    },
    select: safeUserSelect,
  });
}

module.exports = {
  createCustomer,
  findByEmailOrUsername,
  findByEmailWithPassword,
  findById,
  safeUserSelect,
};
