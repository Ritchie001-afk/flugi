
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// PATCH: Update deal
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const json = await req.json();

        // Destructure allowed update fields
        const {
            title, price, originalPrice, transferCount, baggageInfo,
            entryRequirements, airline, tags, startDate, endDate,
            destination, image, images, url, type, rating,
            reviewCount, reviewSource, reviewUrl, description,
            featuredReviewAuthor, featuredReviewText
        } = json;

        const updateData: any = {
            title, destination, image, url, type, baggageInfo, entryRequirements, airline, description,
            featuredReviewAuthor, featuredReviewText,
            reviewSource, reviewUrl,
            images: images || undefined, // undefined prevents clearing if not sent, though usually we send full array
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

// DELETE: Delete deal (unchanged)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.deal.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (e: any) {
        console.error("API Delete Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
