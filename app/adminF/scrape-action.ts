'use server';

import * as cheerio from 'cheerio';

export async function scrapeTripAdvisor(url: string) {
    if (!url.includes('tripadvisor')) {
        return { error: 'URL musí být z TripAdvisoru' };
    }

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'cs,en-US;q=0.7,en;q=0.3' // Request Czech content
            }
        });

        if (!response.ok) {
            return { error: `Nepodařilo se načíst stránku (Status: ${response.status})` };
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        let data: any = {
            images: [],
            rating: null,
            reviewCount: null,
            featuredReviewAuthor: '',
            featuredReviewText: ''
        };

        // 1. Get Main Image (OG Image)
        const ogImage = $('meta[property="og:image"]').attr('content');
        if (ogImage) data.images.push(ogImage);

        // 2. Try to parse JSON-LD (Best for Rating/Count)
        $('script[type="application/ld+json"]').each((_, el) => {
            try {
                const json = JSON.parse($(el).html() || '{}');
                // Check if it's the right schema (Hotel/LodgingBusiness)
                if (json['@type'] === 'Hotel' || json['@type'] === 'LodgingBusiness' || json['@type'] === 'TouristAttraction') {
                    if (json.aggregateRating) {
                        data.rating = json.aggregateRating.ratingValue;
                        data.reviewCount = json.aggregateRating.reviewCount;
                    }
                    if (json.image) {
                        if (typeof json.image === 'string') data.images.push(json.image);
                        else if (Array.isArray(json.image)) data.images.push(...json.image);
                    }
                }
            } catch (e) {
                // Ignore parse errors
            }
        });

        // 3. Fallback / Scraping HTML for Review (Unreliable due to dynamic classes)
        // Try to find the first review card. Classes like "QWuub" change often.
        // We look for common patterns or attributes `data-test-target="review-title"`

        // Setup for review extraction - looking for a detailed review
        const reviewContainer = $('div[data-test-target="reviews-tab"]');
        if (reviewContainer.length > 0) {
            // Complex scraping logic for hydration content would go here, 
            // but keeping it simple for now as requested.
        }

        // Try to find a span that looks like a review text
        // Heuristic: specific common TA containers
        const firstReviewText = $('span[data-test-target="review-text"]').first().text();
        const firstReviewAuthor = $('a.ui_header_link.social-member-event-MemberEventOnObjectBlock__member--35-jC').first().text();

        if (firstReviewText) data.featuredReviewText = firstReviewText.trim();
        // Author logic on TA is tricky, usually separate from text in the DOM

        return { success: true, data };

    } catch (error: any) {
        console.error('TripAdvisor Scrape Error:', error);
        return { error: 'Chyba serveru při stahování dat: ' + error.message };
    }
}
