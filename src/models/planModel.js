const prisma = require('../config/prisma');

function listActivePlans() {
    return prisma.plan.findMany({
        where: {
            isActive: true,
            deleteAt: null,
        },
        orderBy: {
            monthlyPriceCents: "asc",
        },
    });
}

module.exports = {
    listActivePlans,
}