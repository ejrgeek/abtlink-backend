const prisma = require("../config/prisma");
const { safeUserSelect } = require("./userModel");

const userAdminSelect = {
  ...safeUserSelect,
  _count: {
    select: {
      clicks: true,
      links: true,
      subscriptions: true,
    },
  },
};

function getOverview() {
  return Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.user.count({ where: { role: "ADMIN", deletedAt: null, isActive: true } }),
    prisma.user.count({ where: { role: "CUSTOMER", deletedAt: null } }),
    prisma.link.count({ where: { deletedAt: null } }),
    prisma.link.count({ where: { status: "ACTIVE", deletedAt: null } }),
    prisma.linkClick.count(),
    prisma.plan.count({ where: { deletedAt: null } }),
    prisma.subscription.count({ where: { deletedAt: null } }),
  ]).then(
    ([
      usersTotal,
      adminsActive,
      customersTotal,
      linksTotal,
      linksActive,
      clicksTotal,
      plansTotal,
      subscriptionsTotal,
    ]) => ({
      usersTotal,
      adminsActive,
      customersTotal,
      linksTotal,
      linksActive,
      clicksTotal,
      plansTotal,
      subscriptionsTotal,
    })
  );
}

function listUsers(filters = {}) {
  const where = {
    deletedAt: null,
  };

  if (filters.role) {
    where.role = filters.role;
  }

  if (typeof filters.isActive === "boolean") {
    where.isActive = filters.isActive;
  }

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { email: { contains: filters.search, mode: "insensitive" } },
      { username: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return prisma.user.findMany({
    where,
    select: userAdminSelect,
    orderBy: {
      createdAt: "desc",
    },
  });
}

function getUserById(id) {
  return prisma.user.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    select: {
      ...userAdminSelect,
      preference: true,
      subscriptions: {
        include: {
          plan: true,
        },
      },
    },
  });
}

function updateUser(id, data) {
  return prisma.user.update({
    where: { id },
    data,
    select: userAdminSelect,
  });
}

async function softDeleteUser(id) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      email: true,
      username: true,
    },
  });

  const suffix = `deleted-${Date.now()}`;

  return prisma.user.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      isActive: false,
      email: `${suffix}-${user.email}`,
      username: `${suffix}-${user.username}`,
    },
    select: userAdminSelect,
  });
}

function listLinks(filters = {}) {
  const where = {
    deletedAt: null,
  };

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.userId) {
    where.userId = filters.userId;
  }

  return prisma.link.findMany({
    where,
    include: {
      qrCode: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
          role: true,
          isActive: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

function getLinkById(id) {
  return prisma.link.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      qrCode: true,
      user: {
        select: safeUserSelect,
      },
      _count: {
        select: {
          clicks: true,
        },
      },
    },
  });
}

function updateLink(id, data) {
  return prisma.link.update({
    where: { id },
    data,
    include: {
      qrCode: true,
      user: {
        select: safeUserSelect,
      },
    },
  });
}

async function softDeleteLink(id) {
  const link = await prisma.link.findUnique({
    where: { id },
    select: {
      slug: true,
      shortUrl: true,
    },
  });

  const suffix = `deleted-${Date.now()}`;

  return prisma.link.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      status: "ARCHIVED",
      slug: `${link.slug}-${suffix}`,
      shortUrl: `${link.shortUrl}-${suffix}`,
    },
    include: {
      qrCode: true,
      user: {
        select: safeUserSelect,
      },
    },
  });
}

function listPlans({ includeInactive = false } = {}) {
  return prisma.plan.findMany({
    where: includeInactive
      ? { deletedAt: null }
      : {
          isActive: true,
          deletedAt: null,
        },
    orderBy: {
      monthlyPriceCents: "asc",
    },
  });
}

function getPlanById(id) {
  return prisma.plan.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });
}

function createPlan(data) {
  return prisma.plan.create({
    data,
  });
}

function updatePlan(id, data) {
  return prisma.plan.update({
    where: { id },
    data,
  });
}

async function softDeletePlan(id) {
  const plan = await prisma.plan.findUnique({
    where: { id },
    select: {
      name: true,
    },
  });

  return prisma.plan.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      isActive: false,
      name: `deleted-${Date.now()}-${plan.name}`,
    },
  });
}

module.exports = {
  createPlan,
  getLinkById,
  getOverview,
  getPlanById,
  getUserById,
  listLinks,
  listPlans,
  listUsers,
  softDeleteLink,
  softDeletePlan,
  softDeleteUser,
  updateLink,
  updatePlan,
  updateUser,
};
