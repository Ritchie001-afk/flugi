'use server';

import { createSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
    const password = formData.get('password') as string;
    const correctPassword = process.env.ADMIN_PASSWORD || 'FlugiSup3rS3cur3!2024'; // Fallback for dev/missing env

    console.log(`Login Attempt: Input Length=${password?.length}, Expected Length=${correctPassword?.length}`);

    if (password !== correctPassword) {
        console.log("Login Failed: Password mismatch");
        // Return error state instead of redirecting if possible, or redirect with param
        return { error: 'Nesprávné heslo' };
    }

    try {
        await createSession();
        // Return success to let client handle redirect
        return { success: true };
    } catch (e: any) {
        console.error("Create Session Error:", e);
        return { error: `Session Error: ${e.message}` };
    }
}

export async function logout() {
    await deleteSession();
    redirect('/adminF/login');
}
