
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
    // Cloudinary text styles: font_size_style...
    // We use standard fonts available in Cloudinary (Montserrat is usually available, if not, fallback to Arial/Roboto)
    const font = 'Montserrat';

    // Title: Upper case, bold
    const titleText = encodeURIComponent(deal.title.toUpperCase());

    // Price: e.g. "12 990 Kč"
    // Format price with spaces? deal.price is number.
    const priceFormatted = new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(deal.price);
    const priceText = encodeURIComponent(priceFormatted);

    // 3. Construct URL parts
    // Base Transformations: 1200x630, fill, quality auto
    const baseConfig = 'c_fill,h_630,q_auto,w_1200';

    // Blue Tint Overlay (Simulates brand color overlay)
    // co_rgb:0041A0,e_colorize:40 means 40% strength blue tint
    const colorOverlay = 'co_rgb:0041A0,e_colorize:40';

    // Title Layer
    // White text, bottom left, width 800px limit (crop/fit), offset x60 y160
    // l_text:<font>_<size>_bold:<text>
    const titleLayer = `l_text:${font}_60_bold:${titleText},c_fit,w_1000,co_white,g_south_west,x_60,y_180`;

    // Price Layer (Pink Tag Simulation)
    // We use a text layer with background color to simulate the tag.
    // bg_rgb:E11D48 (Pink)
    // bo_15px_solid_rgb:E11D48 (Border to create padding)
    const priceLayer = `l_text:${font}_50_bold:${priceText},co_white,b_rgb:E11D48,bo_15px_solid_rgb:E11D48,g_south_west,x_60,y_80,r_10`;
    // r_10 adds rounded corners to the background box!

    // Flugi Logo? 
    // We can add text "Flugi.cz" top left?
    const logoLayer = `l_text:${font}_40_bold:Flugi.cz ✈️,co_white,g_north_west,x_60,y_60`;

    // 4. Assemble Final URL
    // Format: https://res.cloudinary.com/<cloud_name>/image/fetch/<transforms>/<url>

    return `https://res.cloudinary.com/${cloudName}/image/fetch/${baseConfig}/${colorOverlay}/${titleLayer}/${priceLayer}/${logoLayer}/${imageUrl}`;
}
