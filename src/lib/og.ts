
import { getDestinationImage } from '@/lib/images';

export function getCloudinaryOgUrl(deal: any): string {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'flugi';

    // 1. Get Base Image
    let imageUrl = getDestinationImage(deal.destination, deal.image);

    // --- Cloudinary Native Detection ---
    const cloudinaryRegex = /res\.cloudinary\.com\/[^/]+\/image\/upload\/(?:v\d+\/)?(.+)/;
    const match = imageUrl.match(cloudinaryRegex);

    let isNative = false;
    let publicId = '';

    if (match && match[1]) {
        isNative = true;
        publicId = match[1];
        // Strip extension (e.g. .jpg, .png) to ensure canonical Public ID usage
        const dotIndex = publicId.lastIndexOf('.');
        if (dotIndex > -1) {
            publicId = publicId.substring(0, dotIndex);
        }
    }

    // If NOT native and path is relative, make it absolute.
    if (!isNative && imageUrl.startsWith('/')) {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.flugi.cz';
        imageUrl = `${baseUrl}${imageUrl}`;
    }

    const font = 'Montserrat';

    // --- Data Prep ---
    const subTitle = (deal.type === 'flight' ? 'AKČNÍ LETENKA' : 'AKČNÍ ZÁJEZD');
    const mainTitle = deal.title.toUpperCase();

    const subTitleText = encodeURIComponent(subTitle);
    const mainTitleText = encodeURIComponent(mainTitle);

    const priceFormatted = new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(deal.price);
    const priceText = encodeURIComponent(priceFormatted);

    // Info Box Lines (NO EMOJIS to prevent corruption)
    let infoLines = [];
    if (deal.startDate && deal.endDate) {
        try {
            const start = new Date(deal.startDate);
            const end = new Date(deal.endDate);
            const fmt = (d: Date) => `${d.getDate()}.${d.getMonth() + 1}.`;
            infoLines.push(`${fmt(start)} - ${fmt(end)} ${end.getFullYear()}`);
        } catch (e) { }
    }
    if (deal.airline) {
        infoLines.push(`${deal.airline}`);
    }

    // Join with bullet
    const infoText = encodeURIComponent(infoLines.join('  •  ') || 'Termín na vyžádání');


    // --- Layer Definitions ---

    // 1. Background Config
    const baseConfig = 'c_fill,h_630,q_auto,w_1200,b_rgb:001529';
    const gradientEffect = 'e_gradient_fade,x_0.5,g_west';

    // 2. Info Box
    const infoBoxLayer = `l_text:${font}_30_bold:${infoText},co_rgb:0f172a,b_white,bo_40px_solid_white,r_25,g_south_west,x_60,y_50`;

    // 3. Price Tag
    const priceColor = 'E11D48';
    const priceLayer = `l_text:${font}_65_black:${priceText},co_white,b_rgb:${priceColor},bo_30px_solid_rgb:${priceColor},r_15/fl_layer_apply,a_-3,e_shadow:60,x_15,y_15,co_black,g_south_west,x_40,y_180`;

    // 4. Sub-Title
    const subTitleLayer = `l_text:${font}_26_bold:${subTitleText},co_rgb:cbd5e1,g_south_west,x_60,y_340`;

    // 5. Main Title
    const mainTitleLayer = `l_text:${font}_75_black:${mainTitleText},c_fit,w_900,co_white,g_south_west,x_60,y_380`;

    // 6. Logo (Using Unicode Plane U+2708, escaped as %E2%9C%88. But risk of corruption? Revert to simple text if needed.)
    // Let's try simple text "Flugi.cz" to be 100% safe this time.
    // If user insists on icon, we use an image layer later.
    const logoLayer = `l_text:${font}_45_black:Flugi.cz,co_white,g_north_west,x_50,y_50`;

    // --- Assembly ---
    const layers = [
        baseConfig,
        gradientEffect,
        logoLayer,
        infoBoxLayer,
        priceLayer,
        subTitleLayer,
        mainTitleLayer
    ].filter(Boolean).join('/');

    // Return Native or Fetch URL
    if (isNative) {
        return `https://res.cloudinary.com/${cloudName}/image/upload/${layers}/${publicId}`;
    } else {
        return `https://res.cloudinary.com/${cloudName}/image/fetch/${layers}/${imageUrl}`;
    }
}
