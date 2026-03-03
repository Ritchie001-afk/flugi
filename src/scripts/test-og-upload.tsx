import { ImageResponse } from 'next/og';
import cloudinary from '../lib/cloudinary';
import fs from 'fs';
import path from 'path';

// Replicating Satori Logic
export async function generateOgImageBuffer(title: string, price: string, destination: string, date: string, airline: string, imageUrl: string): Promise<Buffer> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.flugi.cz';

    // Fallback image if missing
    let image = imageUrl;
    if (image && image.startsWith('/')) {
        image = `${baseUrl}${image}`;
    }
    if (!image) {
        image = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200&auto=format&fit=crop';
    }

    // Load fonts from the actual URLs (since this will run in Vercel backend eventually)
    // For local script testing, we'll try to fetch or read locally.
    let fontBlack, fontBold;
    try {
        fontBlack = fs.readFileSync(path.join(process.cwd(), 'public/fonts/Montserrat-Black.ttf'));
        fontBold = fs.readFileSync(path.join(process.cwd(), 'public/fonts/Montserrat-Bold.ttf'));
    } catch {
        // Fallback to fetch if running in deployed environment
        fontBlack = await fetch(new URL(`${baseUrl}/fonts/Montserrat-Black.ttf`)).then(res => res.arrayBuffer());
        fontBold = await fetch(new URL(`${baseUrl}/fonts/Montserrat-Bold.ttf`)).then(res => res.arrayBuffer());
    }

    // --- Icons (SVG) ---
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

    //@ts-ignore - ImageResponse handles React elements
    const element = (
        <div style={{
            display: 'flex', width: '100%', height: '100%', backgroundColor: 'white', position: 'relative', fontFamily: '"Montserrat"',
        }}>
            {/* Background Image */}
            <img src={image} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            {/* Gradient Overlay */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(90deg, #0056b3 0%, rgba(0, 86, 179, 0.8) 45%, rgba(0, 86, 179, 0) 100%)' }} />
            {/* Left Content Column */}
            <div style={{ display: 'flex', flexDirection: 'column', width: '65%', height: '100%', paddingLeft: 60, justifyContent: 'center', alignItems: 'flex-start' }}>
                <div style={{ position: 'absolute', top: 50, left: 60, color: 'white', fontSize: 32, fontWeight: 900, display: 'flex', alignItems: 'center' }}>✈️ Flugi.cz</div>
                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 20, marginTop: 60 }}>
                    <span style={{ color: 'white', fontSize: 30, fontWeight: 700, textTransform: 'uppercase', textShadow: '0 4px 20px rgba(0,0,0,0.5)', marginBottom: 5 }}>AKČNÍ LETENKA</span>
                    <span style={{ color: 'white', fontSize: 70, fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.9, textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>{title}</span>
                </div>
                <div style={{ backgroundColor: '#E11D48', borderRadius: 15, transform: 'rotate(-4deg)', padding: '10px 30px', boxShadow: '0 15px 35px rgba(225, 29, 72, 0.4)', marginBottom: 30, display: 'flex', alignItems: 'center', position: 'relative' }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#881337', position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)' }} />
                    <span style={{ color: 'white', fontSize: 50, fontWeight: 900, marginLeft: 10 }}>{price}</span>
                </div>
                <div style={{ backgroundColor: 'white', borderRadius: 20, padding: '25px', width: '90%', display: 'flex', flexDirection: 'column', gap: 15, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: 22, fontWeight: 700, color: '#0f172a' }}><PlaneIcon /><span>Odkud: Vídeň / Praha</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: 22, fontWeight: 700, color: '#0f172a' }}><PinIcon /><span>Kam: {destination}</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: 22, fontWeight: 700, color: '#0f172a' }}><CalendarIcon /><span>Termín: {date}</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: 22, fontWeight: 700, color: '#0f172a' }}><UserIcon /><span>Aerolinka: {airline}</span></div>
                </div>
            </div>
        </div>
    );

    const response = new ImageResponse(element, {
        width: 1200,
        height: 630,
        fonts: [
            { name: 'Montserrat', data: fontBold, style: 'normal', weight: 700 },
            { name: 'Montserrat', data: fontBlack, style: 'normal', weight: 900 },
        ],
    });

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
}

// Replicating Cloudinary Upload
async function uploadBufferToCloudinary(buffer: Buffer, folder: string): Promise<{ url?: string; error?: string }> {
    return new Promise((resolve) => {
        cloudinary.uploader.upload_stream(
            { folder: folder, resource_type: 'image' },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    resolve({ error: error.message });
                } else {
                    resolve({ url: result?.secure_url });
                }
            }
        ).end(buffer);
    });
}

async function main() {
    console.log("Generating OG Image for test...");
    const priceStr = new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(4500);
    const buffer = await generateOgImageBuffer('Testovací Satori', priceStr, 'Palma de Mallorca', '01.05. - 08.05. 2026', 'Ryanair', 'https://images.unsplash.com/photo-1549419137-b9f16af35f29?q=80&w=1200&auto=format&fit=crop');

    console.log("Generated! Buffer length:", buffer.length);
    console.log("Uploading to Cloudinary...");
    const result = await uploadBufferToCloudinary(buffer, 'flugi_og_cache');
    console.log("Upload Result:", result);
}

// Support running directly via ts-node or transpiled
if (require.main === module) {
    // Need to load environment variables
    require('dotenv').config({ path: '.env.local' });
    main().catch(console.error);
}
