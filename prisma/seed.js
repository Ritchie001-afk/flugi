
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const LOCATIONS = [
    { city: 'Marsa Alam', country: 'Egypt', image: 'https://images.unsplash.com/photo-1544376798-89aa6b82c6cd' },
    { city: 'Hurghada', country: 'Egypt', image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020' },
    { city: 'Antalya', country: 'Turecko', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb' },
    { city: 'Side', country: 'Turecko', image: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f' },
    { city: 'Dubaj', country: 'SAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea90b2009f4' },
    { city: 'Mallorca', country: 'Španělsko', image: 'https://images.unsplash.com/photo-1537905569824-f89f14cceb68' },
];

const FLIGHT_TAGS = ['All Inclusive', 'Rodina', 'Pláž', 'Wellness', 'Luxusní', 'Last Minute'];

async function main() {
    console.log('🌱 Seeding is currently disabled for production.');
    // Seeding logic removed to prevent overwriting manual data
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
