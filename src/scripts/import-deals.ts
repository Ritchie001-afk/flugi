
import prisma from '../lib/db';
import { scrapeInviaDeals, ScrapedDeal } from '../lib/scrapers/invia';
import { scrapePelikanFlights } from '../lib/scrapers/pelikan';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function importDeals() {
    try {
        console.log('Connecting to database...');

        // --- 1. INVIA (Vacations) ---
        console.log('--- Scraping Invia (Vacations) ---');
        const inviaDeals = await scrapeInviaDeals();
        const highValueInvia = inviaDeals.filter(d => d.discountPercentage >= 0.25);

        const inviaByDest = new Map<string, ScrapedDeal[]>();
        highValueInvia.forEach(deal => {
            const country = deal.destination.split(',').pop()?.trim() || deal.destination;
            if (!inviaByDest.has(country)) inviaByDest.set(country, []);
            inviaByDest.get(country)?.push(deal);
        });

        // --- 2. PELIKAN (Flights) ---
        console.log('--- Scraping Pelikan (Flights) ---');
        const pelikanFlights = await scrapePelikanFlights();
        // Pelikan might not have discounts computed always, so we take "cheap" ones or just diversified ones
        // For now, let's take unique destinations from Pelikan too
        const pelikanByDest = new Map<string, any[]>();
        pelikanFlights.forEach(flight => {
            const country = flight.destination.split(',').pop()?.trim() || flight.destination;
            if (!pelikanByDest.has(country)) pelikanByDest.set(country, []);
            pelikanByDest.get(country)?.push(flight);
        });

        // --- MERGE & SAVE ---
        const dealsToSave: any[] = [];

        // Pick best Invia deals
        inviaByDest.forEach((deals) => {
            deals.sort((a, b) => b.discountPercentage - a.discountPercentage);
            if (deals.length > 0) dealsToSave.push({ ...deals[0], type: 'package' });
        });

        // Pick cheapest Pelikan flights
        pelikanByDest.forEach((flights) => {
            flights.sort((a, b) => a.price - b.price); // Cheapest first
            if (flights.length > 0) dealsToSave.push({ ...flights[0], type: 'flight' });
        });

        console.log(`Prepared ${dealsToSave.length} unique deals to save.`);

        let savedCount = 0;
        for (const deal of dealsToSave) {
            const existing = await prisma.deal.findUnique({
                where: { url: deal.url }
            });

            if (!existing) {
                await prisma.deal.create({
                    data: {
                        title: deal.title,
                        slug: deal.url.split('/').pop() || Math.random().toString(36).substring(7),
                        description: deal.type === 'package'
                            ? `Last Minute dovolená do ${deal.destination}. Původní cena: ${deal.originalPrice} Kč.`
                            : `Akční letenka do ${deal.destination}.`,
                        price: deal.price,
                        originalPrice: deal.originalPrice || null,
                        currency: deal.currency,
                        destination: deal.destination,
                        destinationCity: deal.destination.split(',')[0],
                        destinationCountry: deal.destination.split(',').pop()?.trim(),
                        image: deal.image || '',
                        images: deal.image ? [deal.image] : [],
                        url: deal.url,
                        type: deal.type, // 'package' or 'flight'
                        tags: [...deal.tags, 'Automated Import'],
                        isFlashDeal: deal.discountPercentage ? deal.discountPercentage > 0.4 : false, // Mark as flash if discount > 40%
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
        await prisma.$disconnect();
    }
}

importDeals()
    .then(() => {
        console.log('Import finished.');
        process.exit(0);
    })
    .catch((e) => {
        console.error('Fatal import error:', e);
        process.exit(1);
    });
