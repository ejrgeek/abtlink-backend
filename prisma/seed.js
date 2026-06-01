const {PrismaClient} = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {

    await prisma.plan.upsert({
        where: {name: "Gratuito"},
        update: {},
        create: {
            name: "Gratuito",
            monthlyDiscountPercent: 0,
            annualDiscountPercent: 0,
            linkLimit: 5,
            qrCodeLimit: 5,
            customDomainLimit: 0,
            analyticsRetentionDays: 7,
        },
    });

    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
        await prisma.user.upsert({
            where: { email: process.env.ADMIN_EMAIL },
            update: {},
            create: {
                name: "Administrador",
                email: process.env.ADMIN_EMAIL,
                username: "admin",
                passwordHash: await hash(process.env.ADMIN_PASSWORD, 12),
                role: "ADMIN",
                preference: {
                create: {},
                },
            },
        });
    }
    
}

main()
    .then( async () => {
        await prisma.$disconnect();
    })
    .catch( async (error) => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    });