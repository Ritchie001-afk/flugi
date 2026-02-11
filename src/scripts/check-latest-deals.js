
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Fetching latest 5 deals...');
    const deals = await prisma.deal.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            destination: true,
            createdAt: true
        }
    });

    console.log('--- Latest Deals ---');
    deals.forEach(deal => {
        console.log(`ID: ${deal.id}`);
        console.log(`Title: ${deal.title}`);
        console.log(`Slug: ${deal.slug}`);
        console.log(`Price: ${deal.price}`);
        console.log(`Created: ${deal.createdAt}`);
        console.log('-------------------');
    });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
