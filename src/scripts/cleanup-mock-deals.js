
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars
const envPath = path.resolve(__dirname, '../../.env');
const envLocalPath = path.resolve(__dirname, '../../.env.local');
const result1 = dotenv.config({ path: envPath });
const result2 = dotenv.config({ path: envLocalPath });

console.log('Loaded .env:', !!result1.parsed);
console.log('Loaded .env.local:', !!result2.parsed);

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
    console.error('ERROR: DATABASE_URL is not set in environment variables.');
    process.exit(1);
} else {
    // Log masked URL to verify it looks correct
    console.log('DATABASE_URL detected:', dbUrl.replace(/:[^:@]+@/, ':***@'));
}

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: dbUrl,
        },
    },
    log: ['info', 'warn', 'error'],
});

async function cleanup() {
    console.log('Starting cleanup of mock deals...');
    try {
        console.log('Attempting to connect...');
        // Force connection
        await prisma.$connect();
        console.log('Connected to database.');

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
