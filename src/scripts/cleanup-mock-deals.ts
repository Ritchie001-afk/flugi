
import prisma from '../lib/db';
import * as dotenv from 'dotenv';
import path from 'path';

// Manual dotenv config to ensure it works in script mode if needed
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function cleanup() {
    console.log('Starting cleanup of mock deals...');
    try {
        const result = await prisma.deal.deleteMany({
            where: {
                provider: 'Mock API Data'
            }
        });
        console.log(`Successfully deleted ${result.count} mock deals.`);
    } catch (error) {
        console.error('Error cleaning up mock deals:', error);
    } finally {
        await prisma.$disconnect();
    }
}

cleanup();
