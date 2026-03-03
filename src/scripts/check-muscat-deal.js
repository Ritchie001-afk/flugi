
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Searching for Muscat deal...');
    const deals = await prisma.deal.findMany({
        where: {
            destination: { contains: 'Muscat', mode: 'insensitive' } // Case-insensitive search
        },
        select: {
            id: true,
            title: true,
            slug: true,
            type: true,
            airline: true,
            baggageInfo: true,
            transferCount: true,
            createdAt: true
        }
    });

    if (deals.length === 0) {
        // Fallback: list latest 5 to see if it's named differently
        console.log('No "Muscat" deal found. Listing latest 5:');
        const latest = await prisma.deal.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: { id: true, title: true, destination: true }
        });
        console.log(latest);
    } else {
        console.log('--- Muscat Deals ---');
        deals.forEach(deal => {
            console.log(`ID: ${deal.id}`);
            console.log(`Title: ${deal.title}`);
            console.log(`Type: ${deal.type}`);
            console.log(`Airline: ${deal.airline}`);
            console.log(`Baggage: ${deal.baggageInfo}`);
            console.log(`Transfers: ${deal.transferCount}`);
            console.log('-------------------');
        });
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
