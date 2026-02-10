
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
    try {
        const deal = await prisma.deal.findFirst();
        if (!deal) {
            console.log('No deals found to test.');
            return;
        }

        console.log(`Testing OG for deal: ${deal.id} (${deal.title})`);
        const url = `http://localhost:3000/api/og?id=${deal.id}`;

        try {
            const res = await fetch(url);
            console.log(`Status: ${res.status}`);
            console.log(`Content-Type: ${res.headers.get('content-type')}`);
            if (res.status === 200) {
                console.log('Success! Image generated.');
            } else {
                console.log('Failed:', await res.text());
            }
        } catch (fetchError) {
            console.error('Fetch error (server might be down or unreachable):', fetchError);
        }

    } catch (e) {
        console.error('Script error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

test();
