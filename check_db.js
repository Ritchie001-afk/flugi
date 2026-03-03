const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
    const deals = await prisma.deal.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: { slug: true, image: true }
    });
    console.log(deals.map(d => ({
        slug: d.slug,
        hasImage: !!d.image,
        isBase64: d.image?.startsWith('data:image')
    })));
}
run();
