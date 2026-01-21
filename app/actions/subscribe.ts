'use server';

import { Resend } from 'resend';
import prisma from '@/lib/db';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function subscribeToNewsletter(formData: FormData) {
    const email = formData.get('email') as string;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { error: 'Zadejte platnou e-mailovou adresu.' };
    }

    try {
        // 1. Save to Database
        // Check if exists first to avoid unique constraint error if we want to handle it gracefully
        const existing = await prisma.subscriber.findUnique({
            where: { email },
        });

        if (existing) {
            // If already exists but inactive, reactivate? Or just say success.
            // For now, let's just return success to not leak info, or simple "Already subscribed"
            return { success: true, message: 'Tento e-mail už sledujeme.' };
        }

        await prisma.subscriber.create({
            data: { email },
        });

        // 2. Send Welcome Email via Resend
        if (process.env.RESEND_API_KEY) {
            await resend.emails.send({
                from: 'Flugi <noreply@resend.dev>', // Or your verified domain
                to: email,
                subject: 'Vítejte v hlídači letenek Flugi ✈️',
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #2563eb;">Vítejte na palubě! 🌍</h1>
                        <p>Děkujeme za registraci do hlídače letenek Flugi.</p>
                        <p>Odteď vám budeme posílat ty nejlepší akční letenky a chybné tarify přímo do vaší schránky.</p>
                        <p>Nebojte, nebudeme vás spamovat. Posíláme jen to, co opravdu stojí za to.</p>
                        <br/>
                        <p style="color: #64748b; font-size: 12px;">Pokud si přejete odhlásit odběr, můžete tak učinit v patičce každého e-mailu.</p>
                    </div>
                `,
            });
        }

        return { success: true };

    } catch (e: any) {
        console.error('Newsletter Error:', e);
        return { error: 'Něco se pokazilo. Zkuste to prosím později.' };
    }
}
