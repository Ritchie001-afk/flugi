
import puppeteer from 'puppeteer';
import fs from 'fs';

async function debugInvia() {
    console.log('Starting Invia debug...');
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    try {
        await page.goto('https://www.invia.cz/last-minute/', { waitUntil: 'networkidle2', timeout: 60000 });

        // Wait a bit specifically
        await new Promise(r => setTimeout(r, 5000));

        const content = await page.content();
        fs.writeFileSync('invia-dump.html', content);
        console.log("HTML dumped to invia-dump.html");

        // Try to print the classes of likely card elements
        const keyElements = await page.evaluate(() => {
            const potentialCards = document.querySelectorAll('div');
            const classes: string[] = [];
            potentialCards.forEach(div => {
                if (div.className && div.className.includes && (div.className.includes('card') || div.className.includes('tour') || div.className.includes('product'))) {
                    classes.push(div.className);
                }
            });
            return classes.slice(0, 20);
        });
        console.log("Potential classes found:", keyElements);

    } catch (e) {
        console.error(e);
    } finally {
        await browser.close();
    }
}

debugInvia();
