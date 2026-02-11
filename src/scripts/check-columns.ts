
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkColumns() {
    try {
        console.log("Checking for 'origin' column in Deal table...");
        // This query works for PostgreSQL to check columns
        const result = await prisma.$queryRaw`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'Deal' AND column_name = 'origin';
        `;
        console.log("Result:", result);

        if (Array.isArray(result) && result.length > 0) {
            console.log("✅ Column 'origin' exists.");
        } else {
            console.log("❌ Column 'origin' does NOT exist.");
        }

        // Also check if we can fetch it via Prisma
        const deal = await prisma.deal.findFirst({
            select: { id: true, origin: true }
        });
        console.log("Fetched deal (partial):", deal);

    } catch (e) {
        console.error("Error checking columns:", e);
    } finally {
        await prisma.$disconnect();
    }
}

checkColumns();
