
import prisma from '../lib/db';

async function verify() {
    console.log("Verifying Slug Implementation...");

    // 1. Check if we can fetch an existing deal by ID using the new logic
    // We'll just fetch any deal and try to find it by ID
    const existingDeal = await prisma.deal.findFirst();
    if (!existingDeal) {
        console.log("No deals found to test.");
        return;
    }

    console.log(`Testing lookup for existing deal: ${existingDeal.title} (${existingDeal.id})`);

    // Simulate the logic in page.tsx
    const foundById = await prisma.deal.findUnique({ where: { id: existingDeal.id } });
    if (foundById) {
        console.log("✅ SUCCESS: Found existing deal by ID.");
    } else {
        console.error("❌ FAILURE: Could not find existing deal by ID.");
    }

    // 2. Create a NEW deal and check slug generation
    console.log("\nCreating a new test deal to verify slug generation...");
    const title = "Testovací Dubaj z Prahy";
    const destination = "Dubaj, SAE";
    const origin = "Praha";

    // Simulate the slug generation logic from the API
    const normalize = (str: string) => str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');

    const destSlug = normalize(destination.split(',')[0]);
    const originSlug = normalize(origin.split(' ')[0]);
    const randomSuffix = 'test'; // Fixed for repeatable test, but in app it's random

    const expectedSlugPrefix = `${destSlug}-z-${originSlug}-`;

    console.log(`Expected slug prefix: ${expectedSlugPrefix}`);

    // Create deal via Prisma (since we can't easily hit the API from here without it running)
    // We will just replicate the API logic here to ensure it writes correctly to DB
    // Ideally we would hit the API, but this verifies the DB schema and Prisma client work

    const randomRealSuffix = Math.random().toString(36).substring(2, 6);
    const generatedSlug = `${destSlug}-z-${originSlug}-${randomRealSuffix}`;

    const newDeal = await prisma.deal.create({
        data: {
            title: title,
            slug: generatedSlug,
            description: "Test description",
            price: 10000,
            destination: destination,
            image: "https://example.com/image.jpg",
            url: "https://example.com",
            origin: origin,
            type: "flight"
        }
    });

    console.log(`Created deal with slug: ${newDeal.slug}`);

    if (newDeal.slug.startsWith('dubaj-z-prahy-')) {
        console.log("✅ SUCCESS: Slug format is correct.");
    } else {
        console.error(`❌ FAILURE: Slug format is incorrect. Got: ${newDeal.slug}`);
    }

    // 3. Verify lookup by Slug
    const foundBySlug = await prisma.deal.findUnique({ where: { slug: newDeal.slug } });
    if (foundBySlug) {
        console.log("✅ SUCCESS: Found new deal by Slug.");
    } else {
        console.error("❌ FAILURE: Could not find new deal by Slug.");
    }

    // Cleanup
    await prisma.deal.delete({ where: { id: newDeal.id } });
    console.log("\nTest deal deleted.");
}

verify()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
