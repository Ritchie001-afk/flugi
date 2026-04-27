import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import prisma from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const slug = req.nextUrl.searchParams.get('slug');

        if (!slug) {
            return new Response('Missing slug', { status: 400 });
        }

        const deal = await prisma.deal.findUnique({ where: { slug } });

        if (!deal) {
            return new Response('Not found', { status: 404 });
        }

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.flugi.cz';

        // Format price
        const price = deal.price
            ? new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(deal.price)
            : '';

        // Format dates
        const startObj = deal.startDate ? new Date(deal.startDate) : null;
        const endObj = deal.endDate ? new Date(deal.endDate) : null;
        const date = startObj && endObj
            ? `${startObj.getDate()}. ${startObj.getMonth() + 1}. – ${endObj.getDate()}. ${endObj.getMonth() + 1}. ${endObj.getFullYear()}`
            : (deal.availableDates || '').split('\n')[0].substring(0, 40) || 'Termín na vyžádání';

        const type = deal.type || 'flight';
        const origin = deal.origin || 'Praha / Vídeň';
        const destination = deal.destination || '';
        const airline = deal.airline || 'Letecky';

        // Optimise Cloudinary image for OG (resize + webp)
        let image = deal.image || '';
        if (image.includes('res.cloudinary.com') && !image.includes('/w_')) {
            image = image.replace('/upload/', '/upload/w_1200,q_80,f_jpg/');
        }
        if (!image) {
            image = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2400&auto=format&fit=crop';
        }

        // Load fonts from /public/fonts/
        const [fontBlack, fontBold] = await Promise.all([
            fetch(new URL(`${baseUrl}/fonts/Montserrat-Black.ttf`)).then(r => {
                if (!r.ok) throw new Error(`Font Black failed: ${r.status}`);
                return r.arrayBuffer();
            }),
            fetch(new URL(`${baseUrl}/fonts/Montserrat-Bold.ttf`)).then(r => {
                if (!r.ok) throw new Error(`Font Bold failed: ${r.status}`);
                return r.arrayBuffer();
            }),
        ]);

        // SVG Icons
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
        const AirlineIcon = () => (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle}>
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 2c-2-2-4-2-5.5-.5L10 5 1.8 6.2l-1 1 5 5L4 15l-1 1 6.5 2.5 2.5 6.5 1-1 1.3-8.3 5 5 1-1z"></path>
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
                    {/* Background photo */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} style={{
                        position: 'absolute',
                        top: 0, left: 0,
                        width: '100%', height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'right center',
                    }} />

                    {/* Blue gradient overlay */}
                    <div style={{
                        position: 'absolute',
                        top: 0, left: 0,
                        width: '100%', height: '100%',
                        background: 'linear-gradient(90deg, #0056b3 0%, rgba(0,86,179,0.85) 42%, rgba(0,86,179,0) 100%)',
                    }} />

                    {/* Left content */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '65%',
                        height: '100%',
                        paddingLeft: 120,
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                    }}>
                        {/* Logo */}
                        <div style={{
                            position: 'absolute',
                            top: 100, left: 120,
                            color: 'white',
                            fontSize: 64,
                            fontWeight: 900,
                            display: 'flex',
                            alignItems: 'center',
                        }}>
                            ✈ Flugi.cz
                        </div>

                        {/* Title */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            marginBottom: 40,
                            marginTop: 120,
                        }}>
                            <span style={{
                                color: 'white',
                                fontSize: 56,
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                textShadow: '0 8px 40px rgba(0,0,0,0.5)',
                                marginBottom: 10,
                            }}>
                                {type === 'package' ? 'AKČNÍ ZÁJEZD' : 'AKČNÍ LETENKA'}:
                            </span>
                            <span style={{
                                color: 'white',
                                fontSize: destination.length > 20 ? 90 : 110,
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                lineHeight: 1.05,
                                textShadow: '0 8px 40px rgba(0,0,0,0.5)',
                            }}>
                                {`Z ${origin.split('(')[0].trim()} do ${destination}`}
                            </span>
                        </div>

                        {/* Price badge */}
                        {price && (
                            <div style={{
                                backgroundColor: '#E11D48',
                                borderRadius: 30,
                                padding: '20px 60px',
                                boxShadow: '0 30px 70px rgba(225,29,72,0.4)',
                                marginBottom: 60,
                                display: 'flex',
                                alignItems: 'center',
                                position: 'relative',
                            }}>
                                <div style={{
                                    width: 24, height: 24, borderRadius: '50%',
                                    backgroundColor: '#881337',
                                    position: 'absolute', left: 30, top: '50%',
                                }} />
                                <span style={{ color: 'white', fontSize: 100, fontWeight: 900, marginLeft: 20 }}>
                                    {price}
                                </span>
                            </div>
                        )}

                        {/* Info card */}
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
                                <AirlineIcon />
                                <span>Letecká společnost: {airline}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            {
                width: 2400,
                height: 1260,
                headers: {
                    'Cache-Control': 'public, max-age=3600, s-maxage=86400',
                },
                fonts: [
                    { name: 'Montserrat', data: fontBold, style: 'normal', weight: 600 },
                    { name: 'Montserrat', data: fontBold, style: 'normal', weight: 700 },
                    { name: 'Montserrat', data: fontBlack, style: 'normal', weight: 900 },
                ],
            }
        );

    } catch (e: any) {
        console.error('OG Image Error:', e);
        return new Response(`Error: ${e.message}`, { status: 500, headers: { 'Content-Type': 'text/plain' } });
    }
}
