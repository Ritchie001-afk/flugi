
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const deals = await prisma.deal.findMany();
        let cleanedCount = 0;

        for (const deal of deals) {
            let needsUpdate = false;
            let newImage = deal.image;
            let newImages = deal.images;

            // Check main image
            if (deal.image && deal.image.startsWith('data:image')) {
                newImage = '';
                needsUpdate = true;
            }

            // Check gallery images
            if (deal.images && deal.images.some((img: string) => img.startsWith('data:image'))) {
                newImages = deal.images.filter((img: string) => !img.startsWith('data:image'));
                needsUpdate = true;
            }

            if (needsUpdate) {
                await prisma.deal.update({
                    where: { id: deal.id },
                    data: {
                        image: newImage,
                        images: newImages
                    }
                });
                cleanedCount++;
            }
        }

        return NextResponse.json({
            success: true,
            cleanedDeals: cleanedCount,
            message: "Databáze byla vyčištěna od velkých obrázků."
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
