import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkLatestDeal() {
    try {
        const deals = await prisma.deal.findMany({
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: {
                id: true,
                title: true,
                slug: true,
                image: true,
                ogImage: true,
                createdAt: true
            }
        });

        console.log("Latest deal inside Database:", JSON.stringify(deals, null, 2));
    } catch (error) {
        console.error("Error querying database:", error);
    } finally {
        await prisma.$disconnect();
    }
}

checkLatestDeal();
