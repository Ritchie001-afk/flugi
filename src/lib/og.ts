
import { getDestinationImage } from '@/lib/images';

export function getCloudinaryOgUrl(deal: any): string {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'flugi';

    // 1. Get Base Image
    let imageUrl = getDestinationImage(deal.destination, deal.image);

    // Robust Regex Detection for Native Cloudinary URLs
    const cloudinaryRegex = /res\.cloudinary\.com\/[^/]+\/image\/upload\/(?:v\d+\/)?(.+)/;
    const match = imageUrl.match(cloudinaryRegex);

    let isNative = false;
    let publicId = '';

    if (match && match[1]) {
        isNative = true;
        publicId = match[1];
        // Strip extension
        const dotIndex = publicId.lastIndexOf('.');
        if (dotIndex > -1) {
            publicId = publicId.substring(0, dotIndex);
        }
    }

    if (!isNative && imageUrl.startsWith('/')) {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.flugi.cz';
        imageUrl = `${baseUrl}${imageUrl}`;
    }

    const font = 'Montserrat';

    // --- Data Prep ---
    const subTitle = (deal.type === 'flight' ? 'AKČNÍ LETENKA' : 'AKČNÍ ZÁJEZD');
    // Remove prefixes to make title cleaner if needed, but user wanted full title.
    const strictMainTitle = deal.title.toUpperCase();

    const priceFormatted = new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(deal.price);
    const priceText = encodeURIComponent(priceFormatted);

    // Info Box Content - STRICTLY NO EMOJIS
    const fmtRef = (d: string) => {
        try {
            const date = new Date(d);
            return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
        } catch { return ''; }
    };

    const dateStr = (deal.startDate && deal.endDate)
        ? `${fmtRef(deal.startDate)} – ${fmtRef(deal.endDate)}`
        : 'Na vyžádání';

    const destinationStr = deal.destination || 'Neznámá destinace';

    // Using plain text bullets/labels
    const lines = [
        `Odlet: Vídeň / Praha (Dle akce)`,
        `Kam: ${destinationStr}`,
        `Termín: ${dateStr}`,
        `Aerolinka: ${deal.airline || 'Letecky'}`
    ];

    const infoText = encodeURIComponent(lines.join('\n'));

    // --- Layer Definitions (Master Design) ---

    // 1. Background (Blue + Gradient Fade)
    const baseConfig = 'c_fill,h_630,q_auto,w_1200,b_rgb:0056b3';
    const gradientEffect = 'e_gradient_fade,x_0.6,g_west';

    // 2. Logo (Top Left)
    const logoLayer = `l_text:${font}_35_heavy:Flugi.cz,co_white,g_north_west,x_60,y_50`;

    // 3. Titles (Left Column)
    const subTitleLayer = `l_text:${font}_30_black:${encodeURIComponent(subTitle)},co_white,g_north_west,x_60,y_130`;

    // Main Destination "Z VÍDNĚ DO..."
    const mainTitleLayer = `l_text:${font}_60_black:${encodeURIComponent(strictMainTitle)},w_700,c_fit,co_white,g_north_west,x_60,y_170,line_spacing_-10`;

    // 4. Price Tag (Pink, Rotated)
    const priceLayer = `l_text:${font}_55_black:${priceText},co_white,b_rgb:E11D48,bo_25px_solid_rgb:E11D48,r_15/fl_layer_apply,a_-4,e_shadow:50,x_10,y_15,co_black,g_north_west,x_60,y_340`;

    // 5. Info Box (White Card)
    const infoContentLayer = `l_text:${font}_24_bold:${infoText},co_rgb:0f172a,b_white,bo_30px_solid_white,r_20,line_spacing_15,g_north_west,x_60,y_460,w_600,c_fit`;

    // --- Assembly ---
    const layers = [
        baseConfig,
        gradientEffect,
        logoLayer,
        subTitleLayer,
        mainTitleLayer,
        priceLayer,
        infoContentLayer
    ].filter(Boolean).join('/');

    // Return Native or Fetch URL
    if (isNative) {
        return `https://res.cloudinary.com/${cloudName}/image/upload/${layers}/${publicId}`;
    } else {
        return `https://res.cloudinary.com/${cloudName}/image/fetch/${layers}/${imageUrl}`;
    }
}
