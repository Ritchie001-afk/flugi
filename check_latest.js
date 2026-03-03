const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const deals = await prisma.deal.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: { slug: true, title: true, price: true }
    });
    console.log(deals);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
