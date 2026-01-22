
import puppeteer from 'puppeteer';
// Note: We use puppeteer-core or puppeteer depending on env, assuming local dev has full puppeteer.

export interface ScrapedDeal {
    title: string;
    description: string;
    price: number;
    originalPrice?: number;
    currency: string;
    discountPercentage: number;
    destination: string;
    image?: string;
    url: string;
    provider: 'Invia' | 'Fischer' | 'Other';
    tags: string[];
}

export async function scrapeInviaDeals(): Promise<ScrapedDeal[]> {
    console.log('Starting Invia scraper...');
    const browser = await puppeteer.launch({
        headless: true, // Set to false to debug visually
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Set a realistic user agent to avoid basic bot detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1920, height: 1080 });

    try {
        await page.goto('https://www.invia.cz/last-minute/', { waitUntil: 'networkidle2', timeout: 60000 });

        // Wait for deal cards
        // Primary selector for deal cards (Tour search results)
        // Invia uses dynamic classes, but often has specific data-testid or structure.
        // Let's try to be more robust.

        // Try waiting for the main list container or items
        // Invia current structure (approx): a.tour-card or div.tour-card
        // Let's grab all <a> tags that look like tour links

        const deals = await page.evaluate(() => {
            const results: any[] = [];
            // Select all potential specific deal cards
            // Current Invia 2024/2025 likely uses IDs or complex classes.
            // Let's look for article or div with class containing 'tour' or 'card'
            const cards = Array.from(document.querySelectorAll('article, .box-tour, [data-testid="tour-card"]'));

            cards.forEach((card) => {
                try {
                    // Title
                    const titleEl = card.querySelector('h2, .tour-card-title, .box-tour__title');
                    const title = titleEl?.textContent?.trim();
                    if (!title) return;

                    // URL
                    const linkEl = card.querySelector('a') || card.closest('a');
                    let url = linkEl?.getAttribute('href');
                    if (url && !url.startsWith('http')) url = 'https://www.invia.cz' + url;
                    if (!url) return;

                    // Image
                    const imgEl = card.querySelector('img');
                    const image = imgEl?.getAttribute('src') || imgEl?.getAttribute('data-src');

                    // Price (e.g. "15 990 Kč")
                    const priceEl = card.querySelector('.price, .tour-card-price, .box-tour__price--actual');
                    const priceText = priceEl?.textContent?.replace(/\s/g, '').replace('Kč', '');
                    const price = priceText ? parseInt(priceText) : 0;
                    if (!price || isNaN(price)) return;

                    // Location/Destination
                    const locationEl = card.querySelector('.location, .tour-card-location, .box-tour__locality');
                    const destination = locationEl?.textContent?.trim() || "Neznámá destinace";

                    results.push({
                        title: title,
                        description: `Dovolená ${destination}`, // Fallback description
                        price: price,
                        currency: 'CZK',
                        discountPercentage: 0.1, // Mock discount if not found, as these are "Last Minute"
                        destination: destination,
                        image: image || "",
                        url: url,
                        provider: 'Invia',
                        tags: ['All Inclusive', 'Last Minute'] // Heuristics
                    });
                } catch (err) {
                    // Skip bad card
                }
            });
            return results;
        });
        console.log(`Found ${deals.length} deals.`);
        return deals as ScrapedDeal[];

    } catch (error) {
        console.error('Error scraping Invia:', error);
        return [];
    } finally {
        await browser.close();
    }
}
