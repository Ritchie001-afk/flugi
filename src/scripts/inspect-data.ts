
import prisma from '../lib/db';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

async function inspectData() {
    try {
        console.log("Connecting to DB...");
        const deals = await prisma.deal.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                title: true,
                destination: true,
                image: true,
                type: true
            }
        });

        console.log("--- LATEST 5 DEALS ---");
        deals.forEach(d => {
            console.log(`Title: ${d.title}`);
            console.log(`Dest:  "${d.destination}"`);
            console.log(`Img:   ${d.image}`);
            console.log(`Type:  ${d.type}`);
            console.log("---");
        });

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

inspectData();
