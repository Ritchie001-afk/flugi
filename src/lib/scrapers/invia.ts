
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
        await page.waitForSelector('.b-product-grid__link', { timeout: 15000 });

        // Scroll to load lazy content
        await page.evaluate(async () => {
            await new Promise<void>((resolve) => {
                let totalHeight = 0;
                const distance = 100;
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    if (totalHeight >= scrollHeight || totalHeight > 3000) { // Limit scroll
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });

        // Extract data
        const deals = await page.evaluate(() => {
            const items: any[] = [];
            const cards = document.querySelectorAll('.b-product-grid__link');

            cards.forEach(card => {
                const titleEl = card.querySelector('.b-product-grid__inline-title');
                const priceEl = card.querySelector('.b-product-grid__price');
                const originalPriceEl = card.querySelector('.b-product-grid__price-original');
                const imageEl = card.querySelector('img');
                const destinationEl = card.querySelector('.b-product-grid__description'); // Approximate selector

                if (titleEl && priceEl) {
                    const title = titleEl.textContent?.trim() || '';
                    const priceText = priceEl.textContent?.replace(/\s/g, '').replace('Kč', '') || '0';
                    const price = parseInt(priceText);

                    let originalPrice = price;
                    if (originalPriceEl) {
                        const origText = originalPriceEl.textContent?.replace(/\s/g, '').replace('Kč', '') || '0';
                        originalPrice = parseInt(origText);
                    }

                    const discount = originalPrice > price ? (originalPrice - price) / originalPrice : 0;

                    const link = (card as HTMLAnchorElement).href;
                    const image = imageEl?.src || '';
                    const destination = destinationEl?.textContent?.trim() || 'Unknown';

                    items.push({
                        title,
                        price,
                        originalPrice,
                        discountPercentage: discount,
                        url: link,
                        image,
                        destination,
                        currency: 'CZK',
                        provider: 'Invia',
                        tags: ['Last Minute']
                    });
                }
            });
            return items;
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
