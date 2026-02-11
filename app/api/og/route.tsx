
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { getDestinationImage } from '@/lib/images';

// export const runtime = 'edge'; // Disabled to allow Prisma to run in Node.js

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        // --- Data Resolution ---
        // Priority 1: Direct Params (faster, no DB)
        let title = searchParams.get('title');
        let price = searchParams.get('price');
        let image = searchParams.get('image');
        let destination = searchParams.get('destination');
        let date = searchParams.get('date');
        let airline = searchParams.get('airline');

        // Priority 2: DB Fetch via ID
        const id = searchParams.get('id');
        if (id && (!title || !price)) {
            const deal = await prisma.deal.findUnique({
                where: { id },
                select: {
                    title: true, price: true, image: true, destination: true,
                    airline: true, startDate: true, endDate: true, type: true
                }
            });
            if (deal) {
                title = deal.title;
                price = new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(deal.price);
                image = getDestinationImage(deal.destination, deal.image);
                destination = deal.destination;

                if (deal.startDate && deal.endDate) {
                    const start = new Date(deal.startDate);
                    const end = new Date(deal.endDate);
                    const fmt = (d: Date) => `${d.getDate()}.${d.getMonth() + 1}.`;
                    date = `${fmt(start)} – ${fmt(end)} ${end.getFullYear()}`;
                }
                airline = deal.airline;
            }
        }

        // Defaults
        if (!title) title = 'Akční Letenka';
        if (!price) price = '';
        if (!destination) destination = '';
        if (!date) date = 'Termín na vyžádání';
        if (!airline) airline = 'Letecky';

        // --- Image URL Resolution ---
        // Ensure absolute URL for Satori
        if (image && image.startsWith('/')) {
            const baseUrl = req.nextUrl.origin || 'https://www.flugi.cz';
            image = `${baseUrl}${image}`;
        }
        // Fallback image if missing
        if (!image) image = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200&auto=format&fit=crop';

        // --- Font Loading ---
        // Need Montserrat Black (900) and Bold (700)
        const fontBlack = await fetch(new URL('https://github.com/JulietaUla/Montserrat/raw/master/fonts/ttf/Montserrat-Black.ttf')).then(res => res.arrayBuffer());
        const fontBold = await fetch(new URL('https://github.com/JulietaUla/Montserrat/raw/master/fonts/ttf/Montserrat-Bold.ttf')).then(res => res.arrayBuffer());

        // --- Icons (SVG) ---
        // Using neutral colors for icons inside the white box
        const iconStyle = { width: 24, height: 24, marginRight: 10 };
        const PlaneIcon = () => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle}>
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>
            </svg>
        );
        const PinIcon = () => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
            </svg>
        );
        const CalendarIcon = () => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
        );
        const UserIcon = () => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
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
                        paddingLeft: 60,
                        justifyContent: 'center', // Center vertically roughly
                        alignItems: 'flex-start',
                    }}>

                        {/* Logo */}
                        <div style={{
                            position: 'absolute',
                            top: 50,
                            left: 60,
                            color: 'white',
                            fontSize: 32,
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
                            marginBottom: 20,
                            marginTop: 60, // Push down a bit
                        }}>
                            <span style={{
                                color: 'white',
                                fontSize: 30,
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                                marginBottom: 5
                            }}>
                                AKČNÍ LETENKA
                            </span>
                            <span style={{
                                color: 'white',
                                fontSize: 70,
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                lineHeight: 0.9,
                                textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                            }}>
                                {title}
                            </span>
                        </div>

                        {/* Price Tag (Levitating) */}
                        <div style={{
                            backgroundColor: '#E11D48',
                            borderRadius: 15,
                            transform: 'rotate(-4deg)',
                            padding: '10px 30px',
                            boxShadow: '0 15px 35px rgba(225, 29, 72, 0.4)',
                            marginBottom: 30,
                            display: 'flex',
                            alignItems: 'center',
                            position: 'relative'
                        }}>
                            {/* Hole */}
                            <div style={{
                                width: 12, height: 12, borderRadius: '50%', backgroundColor: '#881337',
                                position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)'
                            }} />

                            <span style={{
                                color: 'white',
                                fontSize: 50,
                                fontWeight: 900,
                                marginLeft: 10
                            }}>
                                {price}
                            </span>
                        </div>

                        {/* White Info Card */}
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: 20,
                            padding: '25px',
                            width: '90%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 15,
                            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                        }}>
                            {/* Items */}
                            <div style={{ display: 'flex', alignItems: 'center', fontSize: 22, fontWeight: 700, color: '#0f172a' }}>
                                <PlaneIcon />
                                <span>Odkud: Vídeň / Praha</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', fontSize: 22, fontWeight: 700, color: '#0f172a' }}>
                                <PinIcon />
                                <span>Kam: {destination}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', fontSize: 22, fontWeight: 700, color: '#0f172a' }}>
                                <CalendarIcon />
                                <span>Termín: {date}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', fontSize: 22, fontWeight: 700, color: '#0f172a' }}>
                                <UserIcon />
                                <span>Aerolinka: {airline}</span>
                            </div>
                        </div>

                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
                fonts: [
                    {
                        name: 'Montserrat',
                        data: fontBold,
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
        console.error(e);
        return new Response('Error generating image', { status: 500 });
    }
}
