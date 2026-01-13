'use server';

import { createSession, deleteSession } from '@/lib/session';
import prisma from '@/lib/db';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- Auth Actions ---

import { getDestinationImage } from '@/lib/images';

// --- AI Actions ---

export async function findImageAction(destination: string) {
    const url = getDestinationImage(destination, '');
    // If it returns empty string (meaning no match and no fallback provided), we return error or generic
    if (!url) return { error: 'Nenašel jsem obrázek pro tuto destinaci.' };
    return { url };
}

export async function generateDescriptionAction(destination: string) {
    if (!process.env.GEMINI_API_KEY) return { error: 'Chybí API klíč' };

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Stable model

        const prompt = `Napiš lákavý marketingový popis pro dovolenou v destinaci "${destination}". 
        Délka cca 2-3 krátké odstavce (do 100 slov). 
        Zaměř se na pláže, moře, relax, jídlo nebo památky (podle destinace).
        Česky. Nepoužívej markdown nadpisy, jen čistý text.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        return { text };
    } catch (e: any) {
        console.error("Gemini Error:", e);
        return { error: `Chyba AI: ${e.message || 'Neznámá chyba'}` };
    }
}

export async function login(formData: FormData) {
    const password = formData.get('password') as string;
    const correctPassword = process.env.ADMIN_PASSWORD || 'flugi123'; // Fallback for dev

    if (password !== correctPassword) {
        redirect('/admin/login?error=invalid');
    }

    await createSession();
    redirect('/admin');
}

export async function logout() {
    await deleteSession();
    redirect('/admin/login');
}

// --- Deal Actions ---

export async function createDeal(formData: FormData) {
    const title = formData.get('title') as string;
    const price = parseFloat(formData.get('price') as string);
    const destination = formData.get('destination') as string;
    const image = formData.get('image') as string;
    const url = formData.get('url') as string;
    const type = formData.get('type') as string;
    const tagsStr = formData.get('tags') as string; // "Tag1, Tag2"

    if (!title || !price || !destination || !url) {
        redirect('/admin?error=missing_fields');
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
        revalidatePath('/zajezdy');
        revalidatePath('/deals');
        revalidatePath('/admin');
    } catch (e) {
        console.error(e);
        // In a real app we would return error, but for simple form action we might just log
    }
    // Always redirect or revalidate
    redirect('/admin');
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
