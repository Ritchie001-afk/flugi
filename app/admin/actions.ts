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
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

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

export async function generateEntryRequirementsAction(destination: string) {
    if (!process.env.GEMINI_API_KEY) return { error: 'Chybí API klíč' };

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const prompt = `Jaké jsou aktuální vstupní podmínky a vízová povinnost pro občany ČR do destinace "${destination}"?
        Odpověz stručně (max 2 věty).
        Na konec PŘIDEJ oficiální odkaz na stránky Ministerstva zahraničních věcí ČR (mzv.cz) s informacemi pro tuto zemi/oblast.
        Pokud odkaz neznáš přesně, vygeneruj odkaz na vyhledávání na mzv.cz.
        Formát: "[Podmínky]. Více info: [URL]"`;

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
    const originalPriceStr = formData.get('originalPrice') as string;
    const originalPrice = originalPriceStr ? parseFloat(originalPriceStr) : null;
    const destination = formData.get('destination') as string;
    const image = formData.get('image') as string;
    const url = formData.get('url') as string;
    const type = formData.get('type') as string;
    const transferCountStr = formData.get('transferCount') as string;
    const transferCount = transferCountStr ? parseInt(transferCountStr) : null;
    const baggageInfo = formData.get('baggageInfo') as string;
    const entryRequirements = formData.get('entryRequirements') as string;
    const airline = formData.get('airline') as string;
    const tagsStr = formData.get('tags') as string; // "Tag1, Tag2"

    if (!title || !price || !destination || !url) {
        redirect('/admin?error=missing_fields');
    }

    const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()) : [];

    // Parse images array
    const imagesStr = formData.get('images') as string;
    let images: string[] = [];
    try {
        images = imagesStr ? JSON.parse(imagesStr) : [];
    } catch (e) {
        images = [];
    }
    // Ensure main image is in the list if not already
    if (!images.includes(image)) {
        images.unshift(image);
    }

    // Parse reviews
    const ratingStr = formData.get('rating') as string;
    const rating = ratingStr ? parseFloat(ratingStr) : null;
    const reviewCountStr = formData.get('reviewCount') as string;
    const reviewCount = reviewCountStr ? parseInt(reviewCountStr) : null;
    const reviewSource = formData.get('reviewSource') as string;
    const reviewUrl = formData.get('reviewUrl') as string;

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
                originalPrice,
                transferCount,
                baggageInfo,
                entryRequirements,
                airline,
                currency: 'CZK',
                destination,
                image,
                images, // Add this
                url,
                type,
                slug,
                tags,
                rating,
                reviewCount,
                reviewSource,
                reviewUrl,
                expiresAt: null
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


export async function updateDeal(id: string, formData: FormData) {
    // Session is handled by middleware, or we could verify it here with getSession()
    // but definitely DO NOT create a new one with hardcoded password!


    const title = formData.get('title') as string;
    const price = parseFloat(formData.get('price') as string);
    const originalPriceStr = formData.get('originalPrice') as string;
    const originalPrice = originalPriceStr ? parseFloat(originalPriceStr) : null;
    const destination = formData.get('destination') as string;
    const image = formData.get('image') as string;
    const url = formData.get('url') as string;
    const type = formData.get('type') as string;
    const transferCountStr = formData.get('transferCount') as string;
    const transferCount = transferCountStr ? parseInt(transferCountStr) : null;
    const baggageInfo = formData.get('baggageInfo') as string;
    const entryRequirements = formData.get('entryRequirements') as string;
    const airline = formData.get('airline') as string;
    const tags = (formData.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean);

    // Parse images array
    const imagesStr = formData.get('images') as string;
    let images: string[] = [];
    try {
        images = imagesStr ? JSON.parse(imagesStr) : [];
    } catch (e) {
        images = [];
    }
    // Ensure main image is in the list if not already
    if (!images.includes(image)) {
        images.unshift(image);
    }
    const description = formData.get('description') as string;

    // Parse reviews
    const ratingStr = formData.get('rating') as string;
    const rating = ratingStr ? parseFloat(ratingStr) : null;
    const reviewCountStr = formData.get('reviewCount') as string;
    const reviewCount = reviewCountStr ? parseInt(reviewCountStr) : null;
    const reviewSource = formData.get('reviewSource') as string;
    const reviewUrl = formData.get('reviewUrl') as string;

    // Determine create or update based on id presence (but we have separate functions)
    // Wait, this is updateDeal, let's fix createDeal below or above?
    // This tool call is modifying updateDeal or createDeal?
    // StartLine 132 matches updateDeal in previous view.
    // I need to modify BOTH createDeal and updateDeal.
    // This replacement is for updateDeal logic.
    // For createDeal I need another call or MultiReplace.
    // Let's assume I strictly follow "single contiguous block". I will use MultiReplace for both in next step or now if allowed.
    // I am supposed to use MultiReplace if non-contiguous.
    // createDeal is lines 90-110 approx. updateDeal is 130+.
    // I will use Replace for this chunk (updateDeal vars) and then another for createDeal vars + prisma calls.
    // Actually, let's look at the view_file again.
    // createDeal lines 96-97: price, originalPrice: price * 1.2
    // updateDeal lines 132: const price ... 
    // updateDeal lines 152: price ...

    // I'll stick to replacing the variable extraction in updateDeal first.
    // Wait, I should do createDeal first as it's earlier in file.
    // Let's use multi_replace to do it cleaner.


    await prisma.deal.update({
        where: { id },
        data: {
            title,
            price,
            originalPrice,
            transferCount,
            baggageInfo,
            entryRequirements,
            airline,
            destination,
            image,
            images,
            url,
            type,
            tags,
            description,
            rating,
            reviewCount,
            reviewSource,
            reviewUrl
        }
    });

    revalidatePath('/admin');
    revalidatePath('/zajezdy');
    revalidatePath('/');
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
