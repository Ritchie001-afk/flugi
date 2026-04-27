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

        const price = deal.price
            ? new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(deal.price)
            : '';

        const startObj = deal.startDate ? new Date(deal.startDate) : null;
        const endObj = deal.endDate ? new Date(deal.endDate) : null;
        const date = startObj && endObj
            ? `${startObj.getDate()}. ${startObj.getMonth() + 1}. – ${endObj.getDate()}. ${endObj.getMonth() + 1}. ${endObj.getFullYear()}`
            : (deal.availableDates || '').split('\n')[0].substring(0, 40) || '';

        const type = deal.type || 'flight';
        const typeLabel = type === 'package' ? 'AKČNÍ ZÁJEZD' : 'AKČNÍ LETENKA';
        const origin = deal.origin || '';
        const destination = deal.destination || '';
        const airline = deal.airline || '';

        const titleText = origin && destination
            ? `Z ${origin.split('(')[0].trim()} do ${destination}`
            : destination;
        const titleFontSize = titleText.length > 24 ? 28 : titleText.length > 18 ? 34 : 40;

        let image = deal.image || '';
        if (image.includes('res.cloudinary.com') && !image.includes('/w_')) {
            image = image.replace('/upload/', '/upload/w_1200,q_80,f_jpg/');
        }
        if (!image) {
            image = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200&auto=format&fit=crop';
        }

        return new ImageResponse(
            (
                <div style={{ display: 'flex', width: '1200px', height: '630px', position: 'relative', overflow: 'hidden', fontFamily: 'sans-serif', backgroundColor: '#0056b3' }}>

                    {/* Background photo */}
                    <img src={image} style={{ position: 'absolute', top: 0, left: 0, width: '1200px', height: '630px', objectFit: 'cover', objectPosition: 'right center' }} />

                    {/* Blue gradient overlay left */}
                    <div style={{ display: 'flex', position: 'absolute', top: 0, left: 0, width: '760px', height: '630px', background: 'linear-gradient(90deg, #0046a3 0%, rgba(0,70,163,0.95) 55%, rgba(0,70,163,0.2) 100%)' }}></div>

                    {/* Content column */}
                    <div style={{ display: 'flex', flexDirection: 'column', width: '660px', height: '630px', padding: '26px 38px', position: 'relative' }}>

                        {/* Logo */}
                        <div style={{ display: 'flex', alignItems: 'center', color: 'white', fontSize: 20, fontWeight: 700, marginBottom: 10 }}>
                            ✈ Flugi.cz
                        </div>

                        {/* Type label */}
                        <div style={{ display: 'flex', color: '#93C5FD', fontSize: 12, fontWeight: 700, letterSpacing: 2, marginBottom: 4 }}>
                            {typeLabel}:
                        </div>

                        {/* Title */}
                        <div style={{ display: 'flex', color: 'white', fontSize: titleFontSize, fontWeight: 900, lineHeight: 1.1, marginBottom: 10 }}>
                            {titleText.toUpperCase()}
                        </div>

                        {/* Price badge */}
                        {price !== '' && (
                            <div style={{ display: 'flex', marginBottom: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#E11D48', borderRadius: '30px', padding: '8px 22px', boxShadow: '0 8px 24px rgba(225,29,72,0.4)' }}>
                                    <span style={{ color: 'white', fontSize: 30, fontWeight: 900 }}>{price}</span>
                                </div>
                            </div>
                        )}

                        {/* Info card */}
                        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '16px', padding: '12px 16px', gap: 6 }}>
                            {origin !== '' && (
                                <div style={{ display: 'flex', alignItems: 'center', color: '#0f172a', fontSize: 18, fontWeight: 700 }}>
                                    <span style={{ marginRight: 10, display: 'flex' }}>✈</span>
                                    <span style={{ display: 'flex' }}>Odkud: {origin}</span>
                                </div>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', color: '#0f172a', fontSize: 18, fontWeight: 700 }}>
                                <span style={{ marginRight: 10, display: 'flex' }}>📍</span>
                                <span style={{ display: 'flex' }}>Kam: {destination}</span>
                            </div>
                            {date !== '' && (
                                <div style={{ display: 'flex', alignItems: 'center', color: '#0f172a', fontSize: 18, fontWeight: 700 }}>
                                    <span style={{ marginRight: 10, display: 'flex' }}>📅</span>
                                    <span style={{ display: 'flex' }}>Termín: {date}</span>
                                </div>
                            )}
                            {airline !== '' && (
                                <div style={{ display: 'flex', alignItems: 'center', color: '#0f172a', fontSize: 18, fontWeight: 700 }}>
                                    <span style={{ marginRight: 10, display: 'flex' }}>🛫</span>
                                    <span style={{ display: 'flex' }}>Letecká společnost: {airline}</span>
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
        console.error('OG Image Error:', e.message);
        return new Response(`Error: ${e.message}`, { status: 500, headers: { 'Content-Type': 'text/plain' } });
    }
}
