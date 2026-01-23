'use server';

import { createSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export async function login(prevState: any, formData: FormData) {
    const password = formData.get('password') as string;
    const correctPassword = process.env.ADMIN_PASSWORD || 'flugi123'; // Fallback for dev

    if (password !== correctPassword) {
        // Return error state instead of redirecting if possible, or redirect with param
        return { error: 'Nesprávné heslo' };
    }

    await createSession();
    redirect('/adminF');
}

export async function logout() {
    await deleteSession();
    redirect('/adminF/login');
}
