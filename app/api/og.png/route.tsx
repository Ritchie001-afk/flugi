import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        // --- Data Resolution ---
        // We now require all parameters to be passed in the URL to avoid DB calls.
        const title = searchParams.get('title') || 'Akční Letenka';
        const priceStr = searchParams.get('price');
        const price = priceStr ? new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(Number(priceStr)) : '';
        let image = searchParams.get('image');
        const destination = searchParams.get('destination') || '';
        const date = searchParams.get('date') || 'Termín na vyžádání';
        const type = searchParams.get('type') || 'flight';
        const airline = searchParams.get('airline') || 'Letecky';
        const board = searchParams.get('board') || 'Bez stravy';
        const origin = searchParams.get('origin') || 'Vídeň / Praha';

        // --- Image URL Resolution ---
        const baseUrl = req.nextUrl.origin || 'https://www.flugi.cz';

        // Ensure absolute URL for Satori
        if (image && image.startsWith('/')) {
            image = `${baseUrl}${image}`;
        }
        // Optimize Cloudinary images to prevent massive edge buffer memory crashes and timeouts
        if (image && image.includes('res.cloudinary.com') && !image.includes('w_')) {
            image = image.replace('/upload/', '/upload/w_1200,q_80,f_jpg/');
        }
        // Fallback image if missing
        if (!image) {
            image = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2400&auto=format&fit=crop';
        }

        // --- Font Loading ---
        // Fetch bundled fonts directly from the public/ directory using an absolute URL
        // This avoids Vercel Edge function file trace bugs
        const fontBlack = await fetch(new URL(`${baseUrl}/fonts/Montserrat-Black.ttf`)).then((res) => {
            if (!res.ok) throw new Error(`Failed to load Black font: ${res.statusText}`);
            return res.arrayBuffer();
        });
        const fontBold = await fetch(new URL(`${baseUrl}/fonts/Montserrat-Bold.ttf`)).then((res) => {
            if (!res.ok) throw new Error(`Failed to load Bold font: ${res.statusText}`);
            return res.arrayBuffer();
        });

        // --- Icons (SVG) ---
        // Using neutral colors for icons inside the white box
        const iconStyle = { width: 48, height: 48, marginRight: 20 };
        const PlaneIcon = () => (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle}>
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>
            </svg>
        );
        const PinIcon = () => (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
            </svg>
        );
        const CalendarIcon = () => (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
        );
        const UserIcon = () => (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
            </svg>
        );
        const CoffeeIcon = () => (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle}>
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                <line x1="6" y1="1" x2="6" y2="4"></line>
                <line x1="10" y1="1" x2="10" y2="4"></line>
                <line x1="14" y1="1" x2="14" y2="4"></line>
            </svg>
        );

        return new ImageResponse(
            (
                <div style={{
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'white',
                    position: 'relative',
                    fontFamily: '"Montserrat"',
                }}>
                    {/* 1. Background Image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'right center',
                    }} />

                    {/* 2. Gradient Overlay (Left to Right) */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, #0056b3 0%, rgba(0, 86, 179, 0.8) 45%, rgba(0, 86, 179, 0) 100%)',
                    }} />

                    {/* 3. Left Content Column */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '65%',
                        height: '100%',
                        paddingLeft: 120,
                        justifyContent: 'center', // Center vertically roughly
                        alignItems: 'flex-start',
                    }}>

                        {/* Logo */}
                        <div style={{
                            position: 'absolute',
                            top: 100,
                            left: 120,
                            color: 'white',
                            fontSize: 64,
                            fontWeight: 900,
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            ✈️ Flugi.cz
                        </div>

                        {/* Title Section */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            marginBottom: 40,
                            marginTop: 120, // Push down a bit
                        }}>
                            <span style={{
                                color: 'white',
                                fontSize: 60,
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                textShadow: '0 8px 40px rgba(0,0,0,0.5)',
                                marginBottom: 10
                            }}>
                                {type === 'package' ? 'AKČNÍ ZÁJEZD' : 'AKČNÍ LETENKA'}
                            </span>
                            <span style={{
                                color: 'white',
                                fontSize: title.length > 25 ? 100 : 130,
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                lineHeight: 1.1,
                                textShadow: '0 8px 40px rgba(0,0,0,0.5)',
                            }}>
                                {title}
                            </span>
                        </div>

                        {/* Price Tag (Levitating) */}
                        <div style={{
                            backgroundColor: '#E11D48',
                            borderRadius: 30,
                            transform: 'rotate(-4deg)',
                            padding: '20px 60px',
                            boxShadow: '0 30px 70px rgba(225, 29, 72, 0.4)',
                            marginBottom: 60,
                            display: 'flex',
                            alignItems: 'center',
                            position: 'relative'
                        }}>
                            {/* Hole */}
                            <div style={{
                                width: 24, height: 24, borderRadius: '50%', backgroundColor: '#881337',
                                position: 'absolute', left: 30, top: '50%', transform: 'translateY(-50%)'
                            }} />

                            <span style={{
                                color: 'white',
                                fontSize: 100,
                                fontWeight: 900,
                                marginLeft: 20
                            }}>
                                {price}
                            </span>
                        </div>

                        {/* White Info Card */}
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: 40,
                            padding: '50px',
                            width: '90%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 30,
                            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                        }}>
                            {/* Items */}
                            <div style={{ display: 'flex', alignItems: 'center', fontSize: 44, fontWeight: 700, color: '#0f172a' }}>
                                <PlaneIcon />
                                <span>Odkud: {origin}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', fontSize: 44, fontWeight: 700, color: '#0f172a' }}>
                                <PinIcon />
                                <span>Kam: {destination}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', fontSize: 44, fontWeight: 700, color: '#0f172a' }}>
                                <CalendarIcon />
                                <span>Termín: {date}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', fontSize: 44, fontWeight: 700, color: '#0f172a' }}>
                                {type === 'package' ? <CoffeeIcon /> : <UserIcon />}
                                <span>{type === 'package' ? `Strava: ${board}` : `Aerolinka: ${airline}`}</span>
                            </div>
                        </div>

                    </div>
                </div>
            ),
            {
                width: 2400,
                height: 1260,
                headers: {
                    'Cache-Control': 'public, max-age=3600, immutable',
                },
                fonts: [
                    {
                        name: 'Montserrat',
                        data: fontBold,
                        style: 'normal',
                        weight: 600, // Using Bold for 600 internally
                    },
                    {
                        name: 'Montserrat',
                        data: fontBold, // Use bold instead of black to be slightly thinner, let's remap 700 to bold
                        style: 'normal',
                        weight: 700,
                    },
                    {
                        name: 'Montserrat',
                        data: fontBlack,
                        style: 'normal',
                        weight: 900,
                    },
                ],
            }
        );

    } catch (e: any) {
        console.error('OG API Error:', e);
        return new Response(`Error generating image: ${e.message}\nStack: ${e.stack}`, {
            status: 500,
            headers: {
                'Content-Type': 'text/plain',
            }
        });
    }
}
