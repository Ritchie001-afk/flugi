'use server';

import { Resend } from 'resend';
import prisma from '@/lib/db';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactMessage(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    if (!name || !email || !message) {
        return { error: 'Vyplňte prosím všechna povinná pole.' };
    }

    try {
        // 1. Save to Database
        await prisma.contactMessage.create({
            data: {
                name,
                email,
                subject: subject || 'Nová zpráva z webu',
                message,
            },
        });

        // 2. Send Notification Email to Admin
        if (process.env.RESEND_API_KEY) {
            await resend.emails.send({
                from: 'Flugi Contact <noreply@resend.dev>', // Or your verified domain
                to: 'info@flugi.cz', // Sending to admin info email
                subject: `Nová zpráva: ${subject}`,
                replyTo: email,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2563eb;">Nová zpráva z kontaktního formuláře</h2>
                        <p><strong>Odesílatel:</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p>
                        <p><strong>Předmět:</strong> ${subject}</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px;">
                            <p style="white-space: pre-wrap; margin: 0;">${message}</p>
                        </div>
                    </div>
                `,
            });
        }

        return { success: true };

    } catch (e: any) {
        console.error('Contact Form Error:', e);
        return { error: 'Odeslání se nezdařilo. Zkuste to prosím později.' };
    }
}
