
import prisma from '../lib/db';
import * as dotenv from 'dotenv';
dotenv.config();

async function seedSamplePackage() {
    try {
        console.log("Seeding sample package deal...");

        const deal = await prisma.deal.create({
            data: {
                title: "Luxusní dovolená v Dubaji - Hotel Atlantis The Palm 5*",
                description: "Užijte si týden v jednom z nejikoničtějších hotelů světa. Cena zahrnuje letenku, transfery, ubytování a polopenzi. Aquapark v ceně!",
                price: 34990,
                originalPrice: 45000,
                currency: "CZK",
                destination: "Dubaj, Spojené arabské emiráty",
                image: "https://images.unsplash.com/photo-1512453979798-5ea904ac6605?q=80&w=1920&auto=format&fit=crop",
                url: "https://www.fischer.cz/spojene-arabske-emiraty/dubaj/hotel-atlantis-the-palm",

                type: "package",
                // removed discountPercentage as it is not in schema
                tags: ["All Inclusive", "Luxusní", "Aquapark"]
            }
        });

        console.log(`Created sample deal: ${deal.title} (ID: ${deal.id})`);

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

seedSamplePackage();
