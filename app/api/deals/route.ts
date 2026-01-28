
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
            reviewCount, reviewSource, reviewUrl, featuredReviewAuthor, featuredReviewText
        } = json;

        if (!title || !price || !destination || !url || !image) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }



        const deal = await prisma.deal.create({
            data: {
                title,
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
                expiresAt: null,
            }
        });

        return NextResponse.json({ success: true, deal });
    } catch (e: any) {
        console.error("API Create Deal Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
