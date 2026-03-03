require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const cloudinary = require('cloudinary').v2;
const https = require('https');

// Initialize Prisma
const prisma = new PrismaClient();

// Configure Cloudinary explicitly just in case
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

async function main(slug) {
    try {
        const deal = await prisma.deal.findUnique({ where: { slug } });
        if (!deal) {
            console.error('Deal not found:', slug);
            return;
        }

        console.log('Found deal:', deal.title, deal.id);

        // Construct Edge API URL
        const baseUrl = 'https://www.flugi.cz';
        const params = new URLSearchParams({
            title: deal.title,
            price: deal.price || '',
            destination: deal.destination || '',
            image: (deal.image && !deal.image.startsWith('data:image')) ? deal.image : 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80',
            date: 'Na vyžádání',
            airline: deal.airline || ''
        });

        const apiUrl = `${baseUrl}/api/og.png?${params.toString()}`;
        console.log('Fetching image from Edge API:', apiUrl);

        // Download image from edge route
        const imageBuffer = await new Promise((resolve, reject) => {
            https.get(apiUrl, (res) => {
                if (res.statusCode !== 200) {
                    return reject(new Error(`Failed with status: ${res.statusCode}`));
                }
                const data = [];
                res.on('data', chunk => data.push(chunk));
                res.on('end', () => resolve(Buffer.concat(data)));
            }).on('error', reject);
        });

        console.log('Got buffer size from Edge API:', imageBuffer.length, 'bytes');

        // Upload to Cloudinary
        console.log('Uploading to Cloudinary...');
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: 'flugi_og_cache',
                    resource_type: 'image',
                    api_key: process.env.CLOUDINARY_API_KEY,
                    api_secret: process.env.CLOUDINARY_API_SECRET,
                    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.end(imageBuffer);
        });

        console.log('Upload successful:', result.secure_url);

        // Save to Prisma
        await prisma.deal.update({
            where: { id: deal.id },
            data: { ogImage: result.secure_url }
        });

        console.log('Prisma updated. Deal correctly generated.');

    } catch (err) {
        console.error('Error during execution:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main('bangkok-z-bangkok-pkfq');
