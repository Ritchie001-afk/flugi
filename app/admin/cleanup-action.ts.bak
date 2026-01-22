
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function cleanupImagesAction() {
    'use server';

    try {
        const deals = await prisma.deal.findMany();
        let cleanedCount = 0;

        for (const deal of deals) {
            let needsUpdate = false;
            let newImage = deal.image;
            let newImages = deal.images;

            // Check main image
            if (deal.image && deal.image.startsWith('data:image')) {
                newImage = ''; // Clear it
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

        revalidatePath('/');
        revalidatePath('/admin');
        return { success: true, count: cleanedCount };
    } catch (e) {
        console.error("Cleanup failed:", e);
        return { error: 'Cleanup failed' };
    }
}
