
import puppeteer from 'puppeteer';

export interface ScrapedFlight {
    title: string;
    price: number;
    originalPrice?: number;
    currency: string;
    destination: string;
    image: string;
    url: string;
    tags: string[];
    discountPercentage?: number;
}

export async function scrapePelikanFlights(): Promise<ScrapedFlight[]> {
    console.log('Starting Pelikan flight scraper...');

    // Launch Puppeteer
    const browser = await puppeteer.launch({
        headless: true, // "new" is deprecated, true is the standard
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set viewport and User-Agent
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    try {
        await page.goto('https://www.pelikan.cz/cs/akcni-letenky', {
            waitUntil: 'networkidle2',
            timeout: 60000
        });

        // Click cookie consent if present
        try {
            const cookieBtn = await page.$('xpath///button[contains(text(), "Povolit vše")]');
            if (cookieBtn) {
                await cookieBtn.click();
                await new Promise(r => setTimeout(r, 1000));
            }
        } catch (e) {
            // Ignore cookie errors
        }

        // Wait for cards to load
        await page.waitForSelector('.calendars-item-wrap', { timeout: 15000 });

        // Scroll to load more (do it a few times)
        for (let i = 0; i < 3; i++) {
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
            await new Promise(r => setTimeout(r, 2000));
        }

        // Extract data
        const flights = await page.evaluate(() => {
            const items = document.querySelectorAll('.calendars-item-wrap');
            return Array.from(items).map(item => {
                const city = item.querySelector('.calendars-item-arrival .calendars-item-destinations')?.textContent?.trim() || '';
                const country = item.querySelector('.calendars-item-arrival .calendars-item-countries')?.textContent?.trim() || '';
                const destination = country ? `${city}, ${country}` : city;

                const priceText = item.querySelector('.calendars-item-price')?.textContent?.replace(/\s/g, '').replace('Kč', '').trim() || '0';
                const price = parseInt(priceText, 10);

                // Image is in style background-image
                const imageStyle = item.querySelector('.single-image')?.getAttribute('style');
                // Extract url inside url('...')
                const imageUrlMatch = imageStyle?.match(/url\(["']?(.*?)["']?\)/);
                const image = imageUrlMatch ? imageUrlMatch[1] : '';

                const linkEl = item.querySelector('a.calendars-item-button');
                const relativeUrl = linkEl?.getAttribute('href') || '';
                const url = relativeUrl.startsWith('http') ? relativeUrl : `https://www.pelikan.cz${relativeUrl}`;

                const title = `Letenka do ${destination}`;

                return {
                    title,
                    price,
                    currency: 'CZK',
                    destination,
                    image,
                    url,
                    tags: ['Flight', 'Pelikan'],
                    discountPercentage: 0 // Pelikan often doesn't show original price purely on this card
                };
            });
        });

        console.log(`Scraped ${flights.length} flights from Pelikan.`);
        return flights.filter(f => f.price > 0 && f.destination);

    } catch (error) {
        console.error('Error scraping Pelikan:', error);
        return [];
    } finally {
        await browser.close();
    }
}
