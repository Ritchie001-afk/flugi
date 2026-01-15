
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

const LOCATIONS = [
    { city: 'Marsa Alam', country: 'Egypt', image: 'https://images.unsplash.com/photo-1544376798-89aa6b82c6cd' },
    { city: 'Hurghada', country: 'Egypt', image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020' },
    { city: 'Antalya', country: 'Turecko', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb' },
    { city: 'Side', country: 'Turecko', image: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f' },
    { city: 'Dubaj', country: 'SAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea90b2009f4' },
    { city: 'Mallorca', country: 'Španělsko', image: 'https://images.unsplash.com/photo-1537905569824-f89f14cceb68' },
];

const FLIGHT_TAGS = ['All Inclusive', 'Rodina', 'Pláž', 'Wellness', 'Luxusní', 'Last Minute'];

export async function GET(req: Request) {
    // Simple protection for production
    const url = new URL(req.url);
    const secret = url.searchParams.get('secret');

    // Allow if secret matches OR if we are in development
    if (process.env.NODE_ENV === 'production' && secret !== 'flugi-seed-master') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const deals = [];
        for (let i = 0; i < 20; i++) {
            const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
            const price = Math.floor(Math.random() * (45000 - 12000) + 12000);
            const originalPrice = Math.floor(price * 1.3);
            const rating = (Math.random() * (9.8 - 7.0) + 7.0).toFixed(1);
            const reviewCount = Math.floor(Math.random() * 500);

            // Future date
            const startDate = new Date();
            startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 60) + 5);
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 7);

            deals.push({
                title: `Dovolená ${location.city} - Hotel 5* s All Inclusive`,
                slug: `${location.city.toLowerCase()}-${Math.random().toString(36).substring(7)}`,
                description: `Užijte si fantastickou dovolenou v destinaci ${location.city}, ${location.country}. Čeká na vás luxusní ubytování, skvělé jídlo a nádherné pláže. Ideální pro rodiny s dětmi i páry.`,
                price: price,
                originalPrice: originalPrice,
                currency: 'CZK',
                destination: `${location.city}, ${location.country}`,
                destinationCity: location.city,
                destinationCountry: location.country,
                image: location.image,
                url: 'https://www.invia.cz/',
                type: 'package',
                tags: [
                    FLIGHT_TAGS[Math.floor(Math.random() * FLIGHT_TAGS.length)],
                    FLIGHT_TAGS[Math.floor(Math.random() * FLIGHT_TAGS.length)]
                ].filter((v, i, a) => a.indexOf(v) === i),
                isFlashDeal: Math.random() > 0.8,
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
                rating: parseFloat(rating),
                reviewCount: reviewCount,
                reviewSource: Math.random() > 0.5 ? 'TripAdvisor' : 'Google',
                reviewUrl: 'https://www.tripadvisor.com/',
                provider: 'Mock API Data',
                startDate: startDate,
                endDate: endDate
            });
        }

        // Use transaction or createMany if supported (sqlite/postgres)
        // createMany is supported in Postgres
        await prisma.deal.createMany({
            data: deals,
            skipDuplicates: true
        });

        return NextResponse.json({ success: true, count: deals.length });
    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
