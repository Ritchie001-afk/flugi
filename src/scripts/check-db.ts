
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
            console.log("Sample Deal Title:", first?.title);
            console.log("Sample Deal Image URL:", first?.image);

            const allImages = await prisma.deal.findMany({ select: { image: true, provider: true }, take: 5 });
            console.log("First 5 Images:", allImages);
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
