'use server';

import prisma from '@/lib/db';

export async function deleteDeal(id: string) {
    console.log(`Attempting to delete deal: ${id}`);
    try {
        await prisma.deal.delete({ where: { id } });
        console.log(`Deal ${id} deleted successfully`);
        return { success: true };
    } catch (e: any) {
        console.error("Delete Deal Error:", e);
        return { error: `Chyba při mazání: ${e.message}` };
    }
}
