
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting emergency cleanup...');

    try {
        // 1. Count existing deals
        const count = await prisma.deal.count();
        console.log(`Found ${count} deals in database.`);

        if (count === 0) {
            console.log('Database is already empty.');
            return;
        }

        // 2. Delete all deals
        console.log('Deleting all deals...');
        const result = await prisma.deal.deleteMany({});

        console.log(`Successfully deleted ${result.count} deals.`);

    } catch (error) {
        console.error('Error during cleanup:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
