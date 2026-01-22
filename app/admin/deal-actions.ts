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
    const priceVal = parseFloat(formData.get('price') as string);
    const price = isNaN(priceVal) ? 0 : priceVal;

    const opStr = formData.get('originalPrice') as string;
    const opVal = parseFloat(opStr);
    const originalPrice = (opStr && !isNaN(opVal)) ? opVal : null;

    const tcStr = formData.get('transferCount') as string;
    const tcVal = parseInt(tcStr);
    const transferCount = (tcStr && !isNaN(tcVal)) ? tcVal : null;

    const baggageInfo = formData.get('baggageInfo') as string;
    const entryRequirements = formData.get('entryRequirements') as string;
    const airline = formData.get('airline') as string;
    const tagsStr = formData.get('tags') as string; // "Tag1, Tag2"

    const startDateStr = formData.get('startDate') as string;
    const endDateStr = formData.get('endDate') as string;
    const startDate = startDateStr ? new Date(startDateStr) : null;
    const endDate = endDateStr ? new Date(endDateStr) : null;

    const destination = formData.get('destination') as string;
    const image = formData.get('image') as string;
    const url = formData.get('url') as string;
    const type = formData.get('type') as string;

    // Fixed: Added image validation
    if (!title || !price || !destination || !url || !image) {
        return { error: 'Chybí povinná pole (Název, Cena, Destinace, URL, Obrázek)' };
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
    if (image && !images.includes(image)) {
        images.unshift(image);
    }

    // Parse reviews
    const rStr = formData.get('rating') as string;
    const rVal = parseFloat(rStr);
    const rating = (rStr && !isNaN(rVal)) ? rVal : null;

    const rcStr = formData.get('reviewCount') as string;
    const rcVal = parseInt(rcStr);
    const reviewCount = (rcStr && !isNaN(rcVal)) ? rcVal : null;

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
                description: "Manuálně přidáno",
                price,
                originalPrice,
                transferCount,
                baggageInfo,
                entryRequirements,
                airline,
                currency: 'CZK',
                destination,
                image,
                images,
                url,
                type,
                slug,
                tags,
                rating,
                reviewSource,
                reviewUrl,
                expiresAt: null,
                startDate,
                endDate
            }
        });
        revalidatePath('/zajezdy');
        revalidatePath('/deals');
        revalidatePath('/admin');
    } catch (e: any) {
        console.error("Create Deal Error:", e);
        return { error: `Chyba při ukládání: ${e.message}` };
    }

    // Only redirect if successful (code execution reaches here only if no error thrown/returned in catch)
    redirect('/admin');
}

export async function updateDeal(id: string, formData: FormData) {
    const title = formData.get('title') as string;
    const priceVal = parseFloat(formData.get('price') as string);
    const price = isNaN(priceVal) ? 0 : priceVal;

    const opStr = formData.get('originalPrice') as string;
    const opVal = parseFloat(opStr);
    const originalPrice = (opStr && !isNaN(opVal)) ? opVal : null;

    const tcStr = formData.get('transferCount') as string;
    const tcVal = parseInt(tcStr);
    const transferCount = (tcStr && !isNaN(tcVal)) ? tcVal : null;

    const rStr = formData.get('rating') as string;
    const rVal = parseFloat(rStr);
    const rating = (rStr && !isNaN(rVal)) ? rVal : null;

    const rcStr = formData.get('reviewCount') as string;
    const rcVal = parseInt(rcStr);
    const reviewCount = (rcStr && !isNaN(rcVal)) ? rcVal : null;

    const destination = formData.get('destination') as string;
    const image = formData.get('image') as string;
    const url = formData.get('url') as string;
    const type = formData.get('type') as string;
    const description = formData.get('description') as string;

    const startDateStr = formData.get('startDate') as string;
    const endDateStr = formData.get('endDate') as string;
    const startDate = startDateStr ? new Date(startDateStr) : null;
    const endDate = endDateStr ? new Date(endDateStr) : null;

    // Fixed: Construct data object safely to avoid null on required fields
    const data: any = {
        title,
        price,
        destination,
        url,
        type,
        description,
        originalPrice,
        transferCount,
        baggageInfo: formData.get('baggageInfo') as string,
        airline: formData.get('airline') as string,
        entryRequirements: formData.get('entryRequirements') as string,
        rating,
        reviewCount,
        reviewSource: formData.get('reviewSource') as string,
        reviewUrl: formData.get('reviewUrl') as string,
        tags: (formData.get('tags') as string)?.split(',').map(t => t.trim()).filter(Boolean) || [],
        startDate,
        endDate
    };

    // Only update image if it's provided (not null/empty)
    if (image) {
        data.image = image;
    }

    // Images parsing
    try {
        const imagesStr = formData.get('images') as string;
        data.images = imagesStr ? JSON.parse(imagesStr) : [];
        if (image && !data.images.includes(image)) data.images.unshift(image);
    } catch (e) {
        data.images = [];
    }

    try {
        await prisma.deal.update({
            where: { id },
            data
        });
        revalidatePath('/admin');
        revalidatePath('/zajezdy');
        revalidatePath('/deals');
        revalidatePath('/');
    } catch (e: any) {
        console.error("Update Error:", e);
        return { error: `Chyba při úpravě: ${e.message}` };
    }
    redirect('/admin');
}


export async function deleteDeal(id: string) {
    try {
        await prisma.deal.delete({ where: { id } });
        try {
            revalidatePath('/admin');
            revalidatePath('/zajezdy');
            revalidatePath('/deals');
        } catch (revalError) {
            console.error("Revalidation Error during deleteDeal:", revalError);
            // Continue execution as deletion was successful
        }
        return { success: true };
    } catch (e: any) {
        console.error("Delete Deal Error (Full):", JSON.stringify(e, Object.getOwnPropertyNames(e)));
        return { error: `Chyba při mazání: ${e.message || 'Neznámá chyba serveru'}` };
    }
}
