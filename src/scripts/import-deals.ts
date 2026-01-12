
import prisma from '../lib/db';
import { scrapeInviaDeals, ScrapedDeal } from '../lib/scrapers/invia';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function importDeals() {
    try {
        console.log('Connecting to database...');
        // Prisma connects automatically on first query

        console.log('Scraping Invia...');
        const scrapedDeals = await scrapeInviaDeals();

        // Filter: >= 25% discount
        const highValueDeals = scrapedDeals.filter(d => d.discountPercentage >= 0.25);
        console.log(`Found ${scrapedDeals.length} total deals, ${highValueDeals.length} with >= 25% discount.`);

        // Diversity Logic
        const dealsByDestination = new Map<string, ScrapedDeal[]>();
        highValueDeals.forEach(deal => {
            const country = deal.destination.split(',').pop()?.trim() || deal.destination;
            if (!dealsByDestination.has(country)) dealsByDestination.set(country, []);
            dealsByDestination.get(country)?.push(deal);
        });

        const dealsToSave: ScrapedDeal[] = [];
        dealsByDestination.forEach((deals, country) => {
            deals.sort((a, b) => b.discountPercentage - a.discountPercentage);
            if (deals.length > 0) {
                dealsToSave.push(deals[0]);
                console.log(`Selected best deal for ${country}: ${deals[0].title} (-${Math.round(deals[0].discountPercentage * 100)}%)`);
            }
        });

        // Save to DB using Prisma
        let savedCount = 0;
        for (const deal of dealsToSave) {
            const existing = await prisma.deal.findUnique({
                where: { url: deal.url }
            });

            if (!existing) {
                // Prisma requires matching the model fields exactly
                await prisma.deal.create({
                    data: {
                        title: deal.title,
                        description: `Last Minute do ${deal.destination}. Původní cena: ${deal.originalPrice} Kč.`,
                        price: deal.price,
                        originalPrice: deal.originalPrice || null,
                        currency: deal.currency,
                        destination: deal.destination,      // Flattened
                        destinationCity: deal.destination.split(',')[0],
                        destinationCountry: deal.destination.split(',').pop()?.trim(),
                        image: deal.image || '',
                        images: deal.image ? [deal.image] : [],
                        url: deal.url,
                        type: 'flight',
                        tags: [...deal.tags, 'Automated Import'],
                        isFlashDeal: true,
                        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    }
                });
                savedCount++;
            }
        }

        console.log(`Successfully imported ${savedCount} new deals.`);

    } catch (error) {
        console.error('Import failed:', error);
    } finally {
        // Just let it hang or exit, but for script we can disconnect
        await prisma.$disconnect();
    }
}

importDeals();
