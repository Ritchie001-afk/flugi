const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function audit() {
    try {
        console.log("--- OLDER WORKING DEAL (Lanzarote) ---");
        const oldDeals = await prisma.deal.findMany({
            where: { title: { contains: 'Lanzarote' } },
            take: 2,
            select: { slug: true, title: true, image: true, ogImage: true, createdAt: true }
        });

        for (const d of oldDeals) {
            console.log(`\nDeal: ${d.title} (${d.slug}) [${d.createdAt}]`);
            console.log(`image field length/type: ${d.image ? (d.image.startsWith('https') ? d.image : 'base64 (' + d.image.length + ' chars)') : 'null'}`);
            console.log(`ogImage field: ${d.ogImage ? (d.ogImage.length > 200 ? 'LONG STRING...' : d.ogImage) : 'null'}`);
        }

    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

audit();
