
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
const path = require('path');

// Try loading .env and .env.local
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const prisma = new PrismaClient();

async function main() {
    try {
        const deals = await prisma.deal.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' }
        });
        console.log(JSON.stringify(deals, null, 2));
    } catch (e) {
        console.error(e);
    }
}

main()
    .finally(async () => {
        await prisma.$disconnect();
    });
