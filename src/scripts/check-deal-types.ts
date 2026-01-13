
import prisma from '../lib/db';
import * as dotenv from 'dotenv';
dotenv.config();

async function checkDealTypes() {
    try {
        console.log("Checking deal types...");

        // Count by type
        const byType = await prisma.deal.groupBy({
            by: ['type'],
            _count: {
                id: true
            }
        });
        console.log("Deals by Type:", byType);

        // Count by provider (approximation using URL or we can check title)
        // Since we don't have a provider column, we'll check URL pattern
        const allDeals = await prisma.deal.findMany({
            select: { url: true, type: true }
        });

        let inviaCount = 0;
        let pelikanCount = 0;

        allDeals.forEach(d => {
            if (d.url.includes('invia.cz')) inviaCount++;
            if (d.url.includes('pelikan.cz')) pelikanCount++;
        });

        console.log(`Invia Deals: ${inviaCount}`);
        console.log(`Pelikan Deals: ${pelikanCount}`);

        const inviaExamples = await prisma.deal.findMany({
            where: {
                url: { contains: 'invia.cz' }
            },
            take: 3
        });

        console.log("Invia Examples:", inviaExamples.map(d => ({ title: d.title, type: d.type })));

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkDealTypes();
