
import { getDestinationImage } from '@/lib/images';

export function getCloudinaryOgUrl(deal: any): string {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'flugi';

    // 1. Get Base Image
    let imageUrl = getDestinationImage(deal.destination, deal.image);

    // Cloudinary Fetch API requires absolute URL.
    // If it's a relative path (e.g. /images/lakes/...), we need to make it absolute.
    if (imageUrl.startsWith('/')) {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.flugi.cz';
        imageUrl = `${baseUrl}${imageUrl}`;
    }

    // 2. Prepare Text Overlays
    const font = 'Montserrat';

    // Title
    const titleText = encodeURIComponent(deal.title.toUpperCase());

    // Price
    const priceFormatted = new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(deal.price);
    const priceText = encodeURIComponent(priceFormatted);

    // Info Box Content
    let infoLines = [];

    // Date Range
    if (deal.startDate && deal.endDate) {
        try {
            const start = new Date(deal.startDate);
            const end = new Date(deal.endDate);
            const fmt = (d: Date) => `${d.getDate()}.${d.getMonth() + 1}.`;
            infoLines.push(`Termín: ${fmt(start)} - ${fmt(end)} ${end.getFullYear()}`);
        } catch (e) { }
    }

    // Airline / Type
    if (deal.airline) {
        infoLines.push(`Aerolinka: ${deal.airline}`);
    } else if (deal.type === 'flight') {
        infoLines.push('Typ: Letenka');
    } else {
        infoLines.push('Typ: Zájezd');
    }

    const infoText = encodeURIComponent(infoLines.join('\n'));

    // 3. Construct URL parts
    const baseConfig = 'c_fill,h_630,q_auto,w_1200';
    const colorOverlay = 'co_rgb:0041A0,e_colorize:40';

    // Layout Calculation (Bottom-Up)
    // Bottom padding: 50px
    // Info Box: ~100px -> y_50
    const infoY = 50;

    // Price: Above Info Box -> y_180 (allowing space for box height)
    const priceY = 180;

    // Title: Above Price -> y_280
    const titleY = 280;

    // Info Box Layer
    // White background, black text, rounded corners, padding via border
    const infoLayer = infoText ? `l_text:${font}_26_bold:${infoText},co_rgb:1e293b,b_white,bo_25px_solid_white,r_16,g_south_west,x_60,y_${infoY},w_500,c_fit` : '';

    // Price Layer (Pink Tag)
    const priceLayer = `l_text:${font}_50_bold:${priceText},co_white,b_rgb:E11D48,bo_15px_solid_rgb:E11D48,g_south_west,x_60,y_${priceY},r_16`;

    // Title Layer
    const titleLayer = `l_text:${font}_60_bold:${titleText},c_fit,w_1000,co_white,g_south_west,x_60,y_${titleY}`;

    // Logo Layer (Top Left)
    const logoLayer = `l_text:${font}_35_bold:Flugi.cz ✈️,co_white,g_north_west,x_60,y_60`;

    // 4. Assemble Final URL
    // Filter out empty layers
    const layers = [baseConfig, colorOverlay, titleLayer, priceLayer, infoLayer, logoLayer].filter(Boolean).join('/');

    return `https://res.cloudinary.com/${cloudName}/image/fetch/${layers}/${imageUrl}`;
}
