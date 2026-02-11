import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { getDestinationImage } from '@/lib/images';

// Ensure we are using Node.js runtime for Prisma compatibility
// export const runtime = 'edge'; 

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return new Response('Missing ID', { status: 400 });
        }

        const deal = await prisma.deal.findUnique({
            where: { id },
            select: {
                title: true,
                price: true,
                image: true,
                destination: true,
                airline: true,
                type: true,
                startDate: true,
                endDate: true,
                // Temporarily disable new columns to prevent crash if DB is not synced
                // origin: true,
                // hotel: true,
                // mealPlan: true,
            }
        });

        if (!deal) {
            return new Response('Not found', { status: 404 });
        }

        const { title, price, image: rawImage, destination, airline, type, startDate, endDate } = deal as any;
        const origin = undefined; // Fallback
        const hotel = undefined;
        const mealPlan = undefined;

        // Resolve Image URL (Handle nulls, destination mapping, etc.)
        let image = getDestinationImage(destination, rawImage);

        // Ensure Absolute URL for OG Image (critical for Satori/Vercel)
        if (image.startsWith('/')) {
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.flugi.cz';
            image = `${baseUrl}${image}`;
        }

        // Load Font (Montserrat Bold 700)
        const fontData = await fetch(
            new URL('https://raw.githubusercontent.com/JulietaUla/Montserrat/master/fonts/ttf/Montserrat-Bold.ttf')
        ).then((res) => res.arrayBuffer());

        // Format Date Range
        let dateRange = '';
        let duration = '';
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const days = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

            const formatDate = (d: Date) => `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`;
            dateRange = `${formatDate(start)} – ${formatDate(end)}`;
            duration = `${days} dní`;
        }

        const isFlight = type === 'flight';
        const typeLabel = isFlight ? 'AKČNÍ LETENKA:' : 'AKČNÍ ZÁJEZD:';

        // Construct Main Title (e.g., "Z PRAHY DO DUBAJE")
        let mainTitle = '';
        if (origin && destination) {
            mainTitle = `Z ${origin} DO ${destination}`;
        } else if (destination) {
            mainTitle = `DO ${destination}`;
        } else {
            mainTitle = title;
        }
        mainTitle = mainTitle.toUpperCase();

        // Icons (Blue #0060df)
        const iconColor = '#0060df';
        const planeIcon = (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
        );
        const mapPinIcon = (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
            </svg>
        );
        const calendarIcon = (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
        );
        const seatIcon = (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 9h-4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2z" />
                <path d="M13 16h-2a2 2 0 0 1-2-2v-2a2 2 0 1 1 4 0v4" />
            </svg>
        );
        const utensilsIcon = (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
                <path d="M7 2v20" />
                <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
            </svg>
        );

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: 'transparent',
                        position: 'relative',
                        fontFamily: '"Montserrat"',
                        borderRadius: '40px', // Added rounded corners
                        overflow: 'hidden',   // Clip content to border radius
                    }}
                >
                    {/* Background Image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={image}
                        alt="Background"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />

                    {/* Blue Gradient Overlay (Left to Right) - Semi-transparent */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, rgba(0, 65, 160, 0.85) 0%, rgba(0, 65, 160, 0.4) 60%, rgba(0, 65, 160, 0) 100%)',
                        }}
                    />

                    {/* Logo Flugi (Top Left) */}
                    <div style={{ position: 'absolute', top: 50, left: 60, display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: 'white', fontSize: 32, fontWeight: 800 }}>Flugi.cz ✈️</span>
                    </div>

                    {/* Left Content Column */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 60, // Anchored to bottom
                            left: 60,
                            width: '600px',
                            display: 'flex',
                            flexDirection: 'column',
                            color: 'white',
                            gap: '0px', // Manual spacing control
                        }}
                    >
                        {/* Type Header */}
                        <div style={{
                            fontSize: 24,
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            color: 'white',
                            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                            marginBottom: '10px',
                        }}>
                            {typeLabel}
                        </div>

                        {/* Main Title */}
                        <div style={{
                            fontSize: 64,
                            fontWeight: 900,
                            lineHeight: 1,
                            textTransform: 'uppercase',
                            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                            marginBottom: '20px',
                        }}>
                            {mainTitle}
                        </div>

                        {/* Pink Price Tag */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: '#E11D48',
                            padding: '12px 30px',
                            borderRadius: '16px',
                            alignSelf: 'flex-start',
                            boxShadow: '0 8px 20px -5px rgba(225, 29, 72, 0.5)',
                            marginBottom: '10px', // Closer to the info box
                        }}>
                            {/* Hole Icon */}
                            <div style={{
                                width: 12,
                                height: 12,
                                background: '#be123c',
                                borderRadius: '50%',
                                marginRight: 15,
                                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'
                            }} />

                            <div style={{ display: 'flex', fontSize: 42, fontWeight: 900, color: 'white' }}>
                                {`${price} Kč`}
                            </div>
                        </div>

                        {/* White Info Box (Bottom Left) */}
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            padding: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
                            alignSelf: 'flex-start',
                        }}>
                            {/* Origin */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 24, display: 'flex', justifyContent: 'center' }}>{planeIcon}</div>
                                <div style={{ display: 'flex', fontSize: 20, fontWeight: 600, color: '#1e293b' }}>
                                    <span style={{ color: '#64748b', marginRight: 5 }}>Odkud:</span> {origin || 'Nezadáno'}
                                </div>
                            </div>

                            {/* Dates */}
                            {dateRange && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 24, display: 'flex', justifyContent: 'center' }}>{calendarIcon}</div>
                                    <div style={{ display: 'flex', fontSize: 20, fontWeight: 600, color: '#1e293b' }}>
                                        <span style={{ color: '#64748b', marginRight: 5 }}>Termín:</span> {dateRange}
                                    </div>
                                </div>
                            )}

                            {/* Airline / Meal */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 24, display: 'flex', justifyContent: 'center' }}>{isFlight ? seatIcon : utensilsIcon}</div>
                                <div style={{ display: 'flex', fontSize: 20, fontWeight: 600, color: '#1e293b' }}>
                                    <span style={{ color: '#64748b', marginRight: 5 }}>{isFlight ? 'Aerolinka:' : 'Strava:'}</span> {isFlight ? (airline || 'Nezadáno') : (mealPlan || 'Nezadáno')}
                                </div>
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
                        data: fontData,
                        style: 'normal',
                        weight: 700,
                    },
                ],
            }
        );
    } catch (e: any) {
        console.error(`OG Gen Error: ${e.message}`);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
