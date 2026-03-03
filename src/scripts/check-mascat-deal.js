
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Inspecting SPECIFIC deal: cmlma1qfl0000suekuhvg7bs9');
    const deal = await prisma.deal.findUnique({
        where: { id: 'cmlma1qfl0000suekuhvg7bs9' },
        select: {
            id: true,
            title: true,
            type: true,
            airline: true,
            baggageInfo: true,
            transferCount: true,
            createdAt: true
        }
    });

    console.log(deal);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
