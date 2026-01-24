
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 1. Specify protected and public routes
const protectedRoutes: string[] = []; // Temporarily disabled: ['/adminF']
const publicRoutes: string[] = ['/adminF/login', '/'];

export default async function middleware(req: NextRequest) {
    // 2. Check if the current route is protected
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));

    // Allow login page access without check
    if (path === '/adminF/login') {
        return NextResponse.next();
    }

    // 3. Basic Auth for Admin
    if (path.startsWith('/adminF')) {
        const basicAuth = req.headers.get('authorization');

        if (basicAuth) {
            const authValue = basicAuth.split(' ')[1];
            const [user, pwd] = atob(authValue).split(':');

            const validUser = 'admin'; // Hardcoded username
            const validPass = process.env.ADMIN_PASSWORD || 'FlugiSup3rS3cur3!2024';

            if (user === validUser && pwd === validPass) {
                return NextResponse.next();
            }
        }

        return new NextResponse('Auth Required.', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="Secure Area"',
            },
        });
    }

    return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
