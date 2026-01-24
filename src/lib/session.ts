
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

// Secret key for signing tokens (should be in .env in production)
const secretKey = process.env.SESSION_SECRET || 'complex_secret_key_change_me_in_prod_12345';
const encodedKey = new TextEncoder().encode(secretKey);

// Simplified for debugging (Bypassing jose/crypto)
export async function encrypt(payload: any) {
    // return new SignJWT(payload)
    //     .setProtectedHeader({ alg: 'HS256' })
    //     .setIssuedAt()
    //     .setExpirationTime('7d')
    //     .sign(encodedKey);
    return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export async function decrypt(session: string | undefined = '') {
    try {
        // const { payload } = await jwtVerify(session, encodedKey, {
        //     algorithms: ['HS256'],
        // });
        // return payload;
        if (!session) return null;
        return JSON.parse(Buffer.from(session, 'base64').toString('utf-8'));
    } catch (error) {
        console.error('Session Decrypt Error:', error);
        return null;
    }
}

export async function createSession() {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    let session;
    try {
        session = await encrypt({ user: 'admin', expiresAt });
    } catch (e: any) {
        throw new Error(`Encryption failed: ${e.message}`);
    }

    let cookieStore;
    try {
        // Await cookies() because in recent Next.js versions it is async
        cookieStore = await cookies();
    } catch (e: any) {
        throw new Error(`Cookie store access failed: ${e.message}`);
    }

    try {
        // cookieStore.set('session', session, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production',
        //     expires: expiresAt,
        //     sameSite: 'lax',
        //     path: '/',
        // });
        console.log("Mocking Cookie Set for debugging");
    } catch (e: any) {
        throw new Error(`Cookie set failed: ${e.message}`);
    }
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
}

export async function getSession() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    const payload = await decrypt(session);
    return payload;
}
