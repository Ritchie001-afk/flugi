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
            : (deal.availableDates || '').split('\n')[0].substring(0, 45) || '';

        const type = deal.type || 'flight';
        const typeLabel = type === 'package' ? 'AKČNÍ ZÁJEZD:' : 'AKČNÍ LETENKA:';
        const origin = deal.origin || '';
        const destination = deal.destination || '';
        const airline = deal.airline || '';

        // Title: "Z Prahy do Kodaně" style
        const titleText = origin && destination
            ? `Z ${origin.split('(')[0].trim()} do ${destination}`
            : destination;
        const titleFontSize = titleText.length > 28 ? 38 : titleText.length > 20 ? 46 : 54;

        // Optimise Cloudinary image
        let image = deal.image || '';
        if (image.includes('res.cloudinary.com') && !image.includes('/w_')) {
            image = image.replace('/upload/', '/upload/w_1200,q_80,f_jpg/');
        }
        if (!image) {
            image = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200&auto=format&fit=crop';
        }

        return new ImageResponse(
            (
                <div style={{
                    display: 'flex',
                    width: '1200px',
                    height: '630px',
                    position: 'relative',
                    overflow: 'hidden',
                    fontFamily: 'sans-serif',
                }}>
                    {/* Full-bleed background photo */}
                    <img
                        src={image}
                        style={{
                            position: 'absolute',
                            top: 0, left: 0,
                            width: '1200px', height: '630px',
                            objectFit: 'cover',
                            objectPosition: 'center',
                        }}
                    />

                    {/* Smooth gradient overlay: solid blue left → transparent right */}
                    <div style={{
                        display: 'flex',
                        position: 'absolute',
                        top: 0, left: 0,
                        width: '1200px', height: '630px',
                        background: 'linear-gradient(100deg, #1a50b8 0%, #1a50b8 28%, rgba(26,80,184,0.92) 42%, rgba(26,80,184,0.55) 58%, rgba(26,80,184,0.15) 72%, rgba(26,80,184,0) 85%)',
                    }}></div>

                    {/* Content column */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        width: '640px',
                        height: '630px',
                        padding: '36px 44px',
                        position: 'relative',
                    }}>
                        {/* Logo */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            color: 'white',
                            fontSize: 28,
                            fontWeight: 700,
                            marginBottom: 20,
                        }}>
                            ✈ Flugi.cz
                        </div>

                        {/* Type label */}
                        <div style={{
                            display: 'flex',
                            color: '#93C5FD',
                            fontSize: 18,
                            fontWeight: 700,
                            letterSpacing: 1,
                            marginBottom: 6,
                        }}>
                            {typeLabel}
                        </div>

                        {/* Main title */}
                        <div style={{
                            display: 'flex',
                            color: 'white',
                            fontSize: titleFontSize,
                            fontWeight: 900,
                            lineHeight: 1.1,
                            marginBottom: 22,
                        }}>
                            {titleText.toUpperCase()}
                        </div>

                        {/* Price badge – magenta pill */}
                        {price !== '' && (
                            <div style={{ display: 'flex', marginBottom: 24 }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    backgroundColor: '#e91e8c',
                                    borderRadius: '50px',
                                    padding: '10px 28px',
                                    boxShadow: '0 8px 28px rgba(233,30,140,0.45)',
                                }}>
                                    <span style={{ color: 'white', fontSize: 38, fontWeight: 900 }}>
                                        {price}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Info card – compact, white */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: 'rgba(255,255,255,0.95)',
                            borderRadius: '18px',
                            padding: '14px 20px',
                            gap: 8,
                            width: '520px',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                        }}>
                            {origin !== '' && (
                                <div style={{ display: 'flex', alignItems: 'center', color: '#0f172a', fontSize: 18, fontWeight: 600 }}>
                                    <span style={{ display: 'flex', marginRight: 10, fontSize: 20 }}>✈</span>
                                    <span style={{ display: 'flex' }}>Odkud: <span style={{ fontWeight: 900, marginLeft: 6 }}>{origin}</span></span>
                                </div>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', color: '#0f172a', fontSize: 18, fontWeight: 600 }}>
                                <span style={{ display: 'flex', marginRight: 10, fontSize: 20 }}>📍</span>
                                <span style={{ display: 'flex' }}>Kam: <span style={{ fontWeight: 900, marginLeft: 6 }}>{destination}</span></span>
                            </div>
                            {date !== '' && (
                                <div style={{ display: 'flex', alignItems: 'center', color: '#0f172a', fontSize: 18, fontWeight: 600 }}>
                                    <span style={{ display: 'flex', marginRight: 10, fontSize: 20 }}>📅</span>
                                    <span style={{ display: 'flex' }}>Termín: <span style={{ fontWeight: 900, marginLeft: 6 }}>{date}</span></span>
                                </div>
                            )}
                            {airline !== '' && (
                                <div style={{ display: 'flex', alignItems: 'center', color: '#0f172a', fontSize: 18, fontWeight: 600 }}>
                                    <span style={{ display: 'flex', marginRight: 10, fontSize: 20 }}>🛫</span>
                                    <span style={{ display: 'flex' }}>Letecká spol.: <span style={{ fontWeight: 900, marginLeft: 6 }}>{airline}</span></span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
                headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
            }
        );
    } catch (e: any) {
        console.error('OG Image Error:', e.message);
        return new Response(`Error: ${e.message}`, { status: 500, headers: { 'Content-Type': 'text/plain' } });
    }
}
