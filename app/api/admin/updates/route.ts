
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    console.log("POST /api/admin/updates HIT");
    try {
        const json = await req.json();
        console.log("Update Body:", json);

        const { id, ...data } = json;

        if (!id) {
            return NextResponse.json({ error: "Missing deal ID" }, { status: 400 });
        }

        // Destructure allowed update fields
        const {
            title, price, originalPrice, transferCount, baggageInfo,
            entryRequirements, airline, tags, startDate, endDate,
            destination, image, images, url, type, rating,
            reviewCount, reviewSource, reviewUrl, description,
            featuredReviewAuthor, featuredReviewText,
            availableDates, datePublished, origin, mealPlan, hotel,
            slug, ogImage
        } = data;

        const updateData: any = {
            title, destination, image, url, type, baggageInfo, entryRequirements, airline, description,
            featuredReviewAuthor, featuredReviewText, availableDates,
            reviewSource, reviewUrl, origin, mealPlan, hotel, slug, ogImage,
            datePublished: datePublished ? new Date(datePublished) : undefined,
            weatherInfo: data.weatherInfo,
            images: images || undefined,
            tags: tags || undefined
        };

        // Handle numeric/date fields
        if (price !== undefined) updateData.price = parseFloat(price);
        if (originalPrice !== undefined) updateData.originalPrice = originalPrice ? parseFloat(originalPrice) : null;
        if (rating !== undefined) updateData.rating = rating ? parseFloat(rating) : null;
        if (reviewCount !== undefined) updateData.reviewCount = reviewCount ? parseInt(reviewCount) : null;
        if (transferCount !== undefined) updateData.transferCount = transferCount ? parseInt(transferCount) : null;
        if (startDate !== undefined) updateData.startDate = startDate ? new Date(startDate) : null;
        if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;

        const deal = await prisma.deal.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json({ success: true, deal });
    } catch (e: any) {
        console.error("API Update Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
