
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getDeal(slugOrId) {
    let deal = null;
    try {
        console.log(`Searching for slug: ${slugOrId}`);
        deal = await prisma.deal.findUnique({
            where: { slug: slugOrId },
            select: { id: true, title: true, price: true, destination: true }
        });
    } catch (error) {
        console.error("Error fetching deal:", error);
    }
    return deal;
}

async function generateMetadataMock(slug) {
    const deal = await getDeal(slug);
    const baseUrl = 'https://www.flugi.cz';

    if (!deal) {
        console.log("❌ Deal NOT FOUND in DB");
        return;
    }

    console.log("✅ Deal FOUND:", deal);

    const ogImageUrl = deal.id
        ? `${baseUrl}/api/og?id=${deal.id}`
        : `${baseUrl}/api/og?title=${encodeURIComponent(deal.title)}&price=${encodeURIComponent(deal.price)}&destination=${encodeURIComponent(deal.destination)}`;

    console.log("Generated OG URL:", ogImageUrl);

    // Check for undefined
    if (!ogImageUrl || ogImageUrl.includes('undefined')) {
        console.error("❌ ERROR: URL contains undefined!");
    } else {
        console.log("✅ URL looks valid.");
    }
}

// Test with the problematic slug from user screenshot/logs
generateMetadataMock('lyon-z-lyon-qml2');
generateMetadataMock('shanghai-z-viden-eier');
