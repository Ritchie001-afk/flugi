
import prisma from '@/lib/db';

async function main() {
    const dealId = 'cmlfpg68i0000s4ihokjifwmi';
    const deal = await prisma.deal.findUnique({
        where: { id: dealId },
        select: { id: true, slug: true, title: true }
    });
    console.log("Deal details:", deal);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
