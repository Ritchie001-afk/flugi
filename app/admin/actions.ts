'use server';

import { createSession, deleteSession } from '@/lib/session';
import prisma from '@/lib/db';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// --- Auth Actions ---

export async function login(formData: FormData) {
    const password = formData.get('password') as string;
    const correctPassword = process.env.ADMIN_PASSWORD || 'flugi123'; // Fallback for dev

    if (password !== correctPassword) {
        return { error: 'Nesprávné heslo' };
    }

    await createSession();
    redirect('/admin');
}

export async function logout() {
    await deleteSession();
    redirect('/admin/login');
}

// --- Deal Actions ---

export async function createDeal(prevState: any, formData: FormData) {
    const title = formData.get('title') as string;
    const price = parseFloat(formData.get('price') as string);
    const destination = formData.get('destination') as string;
    const image = formData.get('image') as string;
    const url = formData.get('url') as string;
    const type = formData.get('type') as string;
    const tagsStr = formData.get('tags') as string; // "Tag1, Tag2"

    if (!title || !price || !destination || !url) {
        return { error: 'Vyplňte všechna povinná pole' };
    }

    const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()) : [];

    // Create slug from title
    const slug = title
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-') + '-' + Math.random().toString(36).substring(7);

    try {
        await prisma.deal.create({
            data: {
                title,
                description: "Manuálně přidáno", // Manual deals usually have description in title or separate field
                price,
                originalPrice: price * 1.2, // Mock original price
                currency: 'CZK',
                destination,
                image,
                url,
                type,
                slug,
                tags
            }
        });
        revalidatePath('/zajezdy');
        revalidatePath('/deals');
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: 'Chyba při ukládání do DB' };
    }
}

export async function deleteDeal(id: string) {
    try {
        await prisma.deal.delete({ where: { id } });
        revalidatePath('/admin');
        revalidatePath('/zajezdy');
        revalidatePath('/deals');
    } catch (e) {
        console.error(e);
    }
}
