import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import prisma from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function GET(req: NextRequest) {
    try {
        const slug = req.nextUrl.searchParams.get('slug');
        if (!slug) return new Response('Missing slug', { status: 400 });

        const deal = await prisma.deal.findUnique({ where: { slug } });
        if (!deal) return new Response('Not found', { status: 404 });

        // Format deal data
        const price = deal.price
            ? new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(deal.price)
            : '';

        const startObj = deal.startDate ? new Date(deal.startDate) : null;
        const endObj = deal.endDate ? new Date(deal.endDate) : null;
        const date = startObj && endObj
            ? `${startObj.getDate()}. ${startObj.getMonth() + 1}. – ${endObj.getDate()}. ${endObj.getMonth() + 1}. ${endObj.getFullYear()}`
            : (deal.availableDates || '').split('\n')[0].substring(0, 40) || 'Termín na vyžádání';

        const type = deal.type || 'flight';
        const origin = deal.origin || 'Praha / Vídeň';
        const destination = deal.destination || '';
        const airline = deal.airline || 'Letecky';

        // Optimise Cloudinary image (resize for faster load)
        let image = deal.image || '';
        if (image.includes('res.cloudinary.com') && !image.includes('/w_')) {
            image = image.replace('/upload/', '/upload/w_1200,q_80,f_jpg/');
        }
        if (!image) {
            image = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200&auto=format&fit=crop';
        }

        const typeLabel = type === 'package' ? 'AKČNÍ ZÁJEZD' : 'AKČNÍ LETENKA';
        const titleText = origin && destination
            ? `Z ${origin.split('(')[0].trim()} do ${destination}`
            : destination;
        const titleFontSize = titleText.length > 22 ? 46 : 56;

        // SVG icons (scaled for 1200x630)
        const is = 24; // icon size
        const PlaneIcon = () => (
            <svg width={is} height={is} viewBox="0 0 24 24" fill="none" stroke="#E11D48" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={{ marginRight: 10 }}>
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
        );
        const PinIcon = () => (
            <svg width={is} height={is} viewBox="0 0 24 24" fill="none" stroke="#E11D48" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={{ marginRight: 10 }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
        );
        const CalIcon = () => (
            <svg width={is} height={is} viewBox="0 0 24 24" fill="none" stroke="#E11D48" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={{ marginRight: 10 }}>
                <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
        );
        const AirIcon = () => (
            <svg width={is} height={is} viewBox="0 0 24 24" fill="none" stroke="#E11D48" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={{ marginRight: 10 }}>
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 2c-2-2-4-2-5.5-.5L10 5 1.8 6.2l-1 1 5 5L4 15l-1 1 6.5 2.5 2.5 6.5 1-1 1.3-8.3 5 5 1-1z" />
            </svg>
        );

        return new ImageResponse(
            (
                <div style={{
                    display: 'flex', width: '100%', height: '100%',
                    backgroundColor: 'white', position: 'relative', overflow: 'hidden',
                    fontFamily: 'sans-serif',
                }}>
                    {/* Background photo */}
                    <img src={image} style={{
                        position: 'absolute', top: 0, left: 0,
                        width: '100%', height: '100%',
                        objectFit: 'cover', objectPosition: 'right center',
                    }} />

                    {/* Blue gradient overlay */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        background: 'linear-gradient(90deg, #0056b3 0%, rgba(0,86,179,0.88) 42%, rgba(0,86,179,0.1) 100%)',
                        display: 'flex',
                    }} />

                    {/* Left content */}
                    <div style={{
                        display: 'flex', flexDirection: 'column',
                        width: '62%', height: '100%',
                        padding: '36px 50px',
                        position: 'relative',
                    }}>
                        {/* Logo */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            color: 'white', fontSize: 28, fontWeight: 900, marginBottom: 16,
                        }}>
                            ✈ Flugi.cz
                        </div>

                        {/* Type label */}
                        <div style={{
                            color: '#93C5FD', fontSize: 16, fontWeight: 700,
                            letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6,
                        }}>
                            {typeLabel}:
                        </div>

                        {/* Title */}
                        <div style={{
                            color: 'white', fontSize: titleFontSize, fontWeight: 900,
                            lineHeight: 1.1, textTransform: 'uppercase',
                            textShadow: '0 4px 20px rgba(0,0,0,0.4)',
                            marginBottom: 18,
                            display: 'flex',
                        }}>
                            {titleText}
                        </div>

                        {/* Price badge */}
                        {price && (
                            <div style={{ display: 'flex', marginBottom: 20 }}>
                                <div style={{
                                    backgroundColor: '#E11D48',
                                    borderRadius: 30, padding: '10px 28px',
                                    boxShadow: '0 10px 30px rgba(225,29,72,0.35)',
                                    display: 'flex', alignItems: 'center', position: 'relative',
                                }}>
                                    <div style={{
                                        width: 12, height: 12, borderRadius: '50%',
                                        backgroundColor: '#881337',
                                        position: 'absolute', left: 16, top: '50%',
                                        display: 'flex',
                                    }} />
                                    <span style={{ color: 'white', fontSize: 42, fontWeight: 900, marginLeft: 16 }}>
                                        {price}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Info card */}
                        <div style={{
                            backgroundColor: 'rgba(255,255,255,0.95)',
                            borderRadius: 20, padding: '16px 22px',
                            display: 'flex', flexDirection: 'column', gap: 10,
                            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                        }}>
                            {origin && (
                                <div style={{ display: 'flex', alignItems: 'center', fontSize: 19, fontWeight: 700, color: '#0f172a' }}>
                                    <PlaneIcon />Odkud: {origin}
                                </div>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', fontSize: 19, fontWeight: 700, color: '#0f172a' }}>
                                <PinIcon />Kam: {destination}
                            </div>
                            {date && (
                                <div style={{ display: 'flex', alignItems: 'center', fontSize: 19, fontWeight: 700, color: '#0f172a' }}>
                                    <CalIcon />Termín: {date}
                                </div>
                            )}
                            {airline && (
                                <div style={{ display: 'flex', alignItems: 'center', fontSize: 19, fontWeight: 700, color: '#0f172a' }}>
                                    <AirIcon />Letecká společnost: {airline}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
                headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400' },
            }
        );
    } catch (e: any) {
        console.error('OG Image Error:', e.message, e.stack);
        return new Response(`Error: ${e.message}`, { status: 500, headers: { 'Content-Type': 'text/plain' } });
    }
}
