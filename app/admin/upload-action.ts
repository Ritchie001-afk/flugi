'use server';

import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function uploadImageAction(formData: FormData) {
    const file = formData.get('file') as File;
    if (!file) {
        return { error: 'Žádný soubor nebyl nahrán.' };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Unique filename
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const path = join(process.cwd(), 'public', 'uploads', filename);

    try {
        await writeFile(path, buffer);
        return { url: `/uploads/${filename}` };
    } catch (error) {
        console.error('Upload error:', error);
        return { error: 'Chyba při ukládání souboru.' };
    }
}
