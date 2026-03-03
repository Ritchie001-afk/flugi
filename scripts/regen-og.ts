import { PrismaClient } from '@prisma/client';
import { generateAndUploadOgImage } from '@/lib/og-generator';

const prisma = new PrismaClient();

async function regenerateDealOg(slug: string) {
    try {
        console.log(`[Regen] Finding deal with slug: ${slug}`);

        // 1. Fetch existing deal
        const deal = await prisma.deal.findUnique({
            where: { slug }
        });

        if (!deal) {
            console.error(`[Regen] Deal not found!`);
            return;
        }

        console.log(`[Regen] Found deal: ${deal.title}`);
        console.log(`[Regen] Current OG Image: ${deal.ogImage}`);

        // 2. Generate new OG image using the updated Edge relay method
        console.log(`[Regen] Starting new generation process...`);
        const newOgUrl = await generateAndUploadOgImage(deal);

        if (!newOgUrl) {
            console.error(`[Regen] Failed to generate new OG Image.`);
            return;
        }

        // 3. Update database
        console.log(`[Regen] Success! New URL: ${newOgUrl}`);
        console.log(`[Regen] Updating database...`);

        await prisma.deal.update({
            where: { id: deal.id },
            data: { ogImage: newOgUrl }
        });

        console.log(`[Regen] Database updated successfully!`);

    } catch (error) {
        console.error("[Regen] Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

// Support direct execution via ts-node
if (require.main === module) {
    require('dotenv').config({ path: '.env.local' });
    const testSlug = process.argv[2] || 'bangkok-z-bangkok-pkfq';
    regenerateDealOg(testSlug).catch(console.error);
}
