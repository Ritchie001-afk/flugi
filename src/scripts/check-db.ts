
import prisma from '../lib/db';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function checkDb() {
    try {
        console.log("Checking database...");
        const count = await prisma.deal.count();
        console.log(`Total Deals in DB: ${count}`);

        if (count > 0) {
            const first = await prisma.deal.findFirst();
            console.log("Sample Deal:", first?.title, first?.expiresAt);
        } else {
            console.log("Database is empty!");
        }
    } catch (e) {
        console.error("DB Check failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

checkDb();
