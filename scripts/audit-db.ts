import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function audit() {
    try {
        console.log("--- LATEST DEALS (NEW) ---");
        const newDeals = await prisma.deal.findMany({
            orderBy: { createdAt: 'desc' },
            take: 2,
            select: { slug: true, title: true, image: true, ogImage: true, createdAt: true }
        });

        for (const d of newDeals) {
            console.log(`\nDeal: ${d.title} (${d.slug})`);
            console.log(`image field length/type: ${d.image ? (d.image.startsWith('data:') ? 'base64 (' + d.image.length + ' chars)' : d.image) : 'null'}`);
            console.log(`ogImage field: ${d.ogImage ? (d.ogImage.length > 200 ? 'LONG STRING...' : d.ogImage) : 'null'}`);
        }

        console.log("\n--- OLDER WORKING DEAL (Lanzarote) ---");
        const oldDeals = await prisma.deal.findMany({
            where: { title: { contains: 'Lanzarote' } },
            take: 1,
            select: { slug: true, title: true, image: true, ogImage: true, createdAt: true }
        });

        for (const d of oldDeals) {
            console.log(`\nDeal: ${d.title} (${d.slug})`);
            console.log(`image field length/type: ${d.image ? (d.image.startsWith('data:') ? 'base64 (' + d.image.length + ' chars)' : d.image) : 'null'}`);
            console.log(`ogImage field: ${d.ogImage ? (d.ogImage.length > 200 ? 'LONG STRING...' : d.ogImage) : 'null'}`);
        }

    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

audit();
