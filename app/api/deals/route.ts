
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET: List deals
export async function GET() {
    try {
        const deals = await prisma.deal.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(deals);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// POST: Create deal
export async function POST(req: Request) {
    try {
        const json = await req.json();
        const {
            title, price, originalPrice, transferCount, baggageInfo,
            entryRequirements, airline, tags, startDate, endDate,
            destination, image, images, url, type, rating,
            reviewCount, reviewSource, reviewUrl, featuredReviewAuthor, featuredReviewText,
            availableDates, datePublished, origin, mealPlan, hotel
        } = json;

        if (!title || !price || !destination || !url || !image) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }



        // Generate slug from title
        // Generate slug from destination + origin + short suffix
        // Format: dubaj-z-prahy-x9y2
        const normalize = (str: string) => str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-') // Replace multiple hyphens with single hyphen
            .replace(/^-+/, '')     // Trim start
            .replace(/-+$/, '');    // Trim end

        const destSlug = normalize(destination.split(',')[0]); // Take first part of destination (e.g. "Dubaj")
        const originSlug = origin ? normalize(origin.split(' ')[0]) : 'prahy'; // Default or extracted origin
        const randomSuffix = Math.random().toString(36).substring(2, 6);

        let slug = `${destSlug}-z-${originSlug}-${randomSuffix}`;

        // Fallback if destination is missing/empty (unlikely based on check above)
        if (!destSlug) {
            slug = `${normalize(title)}-${randomSuffix}`;
        }

        const deal = await prisma.deal.create({
            data: {
                title,
                slug,
                description: json.description || "", // Fix: Accept description from FE
                price: parseFloat(price),
                originalPrice: originalPrice ? parseFloat(originalPrice) : null,
                transferCount: transferCount ? parseInt(transferCount) : null,
                baggageInfo,
                entryRequirements,
                airline,
                currency: 'CZK',
                destination,
                image,
                images: images || [],
                url,
                type,
                tags: tags || [],
                rating: rating ? parseFloat(rating) : null,
                reviewCount: reviewCount ? parseInt(reviewCount) : null,
                reviewSource,
                reviewUrl,
                featuredReviewAuthor,
                featuredReviewText,
                weatherInfo: json.weatherInfo || null,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
                datePublished: datePublished ? new Date(datePublished) : new Date(),
                availableDates: availableDates || null,
                expiresAt: null,
                origin,
                mealPlan,
                hotel
            }
        });

        return NextResponse.json({ success: true, deal });
    } catch (e: any) {
        console.error("API Create Deal Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
