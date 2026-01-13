
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from './src/lib/session';

// 1. Specify protected and public routes
const protectedRoutes = ['/admin'];
const publicRoutes = ['/admin/login', '/'];

export default async function middleware(req: NextRequest) {
    // 2. Check if the current route is protected
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));

    // Allow login page access without check
    if (path === '/admin/login') {
        return NextResponse.next();
    }

    // 3. Decrypt the session from the cookie
    if (isProtectedRoute) {
        const cookie = req.cookies.get('session')?.value;
        const session = await decrypt(cookie);

        // 4. Redirect to /login if the user is not authenticated
        if (!session?.user) {
            return NextResponse.redirect(new URL('/admin/login', req.nextUrl));
        }
    }

    return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
