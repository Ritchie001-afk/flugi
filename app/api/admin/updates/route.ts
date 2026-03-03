
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { generateAndUploadOgImage } from '@/lib/og-generator';

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

        // Automatically regenerate OG image during Admin Edit so any title/price/image/origin changes reflect on Facebook
        console.log("Regenerating Cloudinary OG image for edited deal via Admin Updates route...");
        const cloudinaryOgUrl = await generateAndUploadOgImage({
            title: updateData.title || title,
            price: updateData.price || price,
            destination: updateData.destination || destination,
            image: updateData.image || image,
            images: updateData.images || images,
            startDate: updateData.startDate,
            endDate: updateData.endDate,
            availableDates: updateData.availableDates || availableDates,
            airline: updateData.airline || airline,
            origin: updateData.origin || origin
        });

        if (cloudinaryOgUrl) {
            updateData.ogImage = cloudinaryOgUrl;
            console.log("Cloudinary URL appended to Update payload:", cloudinaryOgUrl);
        } else {
            console.log("Failed to generate OG Image during update");
        }

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
