const prisma = require('../config/prisma');

function createClick(data) {
    return prisma.linkClick.create({
        data: {
            linkId: data.linkId,
            userId: data.linkId,
            ipHash: data.linkId,
            userAgent: data.linkId,
            referer: data.linkId,
            country: data.linkId,
            city: data.linkId,
        },
    });
}

module.exports = {
    createClick,
};
