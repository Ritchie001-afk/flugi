
import { getDestinationImage } from '@/lib/images';

export function getCloudinaryOgUrl(deal: any): string {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'flugi';

    // 1. Get Base Image
    let imageUrl = getDestinationImage(deal.destination, deal.image);

    // Cloudinary Fetch API requires absolute URL.
    if (imageUrl.startsWith('/')) {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.flugi.cz';
        imageUrl = `${baseUrl}${imageUrl}`;
    }

    const font = 'Montserrat';

    // --- Data Prep ---
    // Title Split: "AKČNÍ LETENKA" vs "DESTINACE"
    const subTitle = (deal.type === 'flight' ? 'AKČNÍ LETENKA' : 'AKČNÍ ZÁJEZD');
    const mainTitle = deal.title.toUpperCase();

    const subTitleText = encodeURIComponent(subTitle);
    const mainTitleText = encodeURIComponent(mainTitle);

    // Price
    const priceFormatted = new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(deal.price);
    const priceText = encodeURIComponent(priceFormatted);

    // Info Box Lines
    let infoLines = [];
    if (deal.startDate && deal.endDate) {
        try {
            const start = new Date(deal.startDate);
            const end = new Date(deal.endDate);
            const fmt = (d: Date) => `${d.getDate()}.${d.getMonth() + 1}.`;
            infoLines.push(`${fmt(start)} - ${fmt(end)} ${end.getFullYear()}`);
        } catch (e) { }
    }
    // Airline / Type (if fits)
    if (deal.airline) {
        infoLines.push(`${deal.airline}`);
    }

    const infoText = encodeURIComponent(infoLines.join('  •  ') || 'Termín na vyžádání');


    // --- Layer Definitions ---

    // 1. Background Config
    // Deep blue background + Colorize tint to darken image nicely
    const baseConfig = 'c_fill,h_630,q_auto,w_1200,b_rgb:001529';
    const effectConfig = 'co_rgb:001529,e_colorize:50';

    // 2. Info Box (Bottom Left)
    // White card, shadow, rounded. 
    // y_60 from bottom.
    // bo_25px_solid_white creates padding.
    // co_rgb:0f172a (Slate-900 text)
    const infoBoxLayer = `l_text:${font}_28_bold:${infoText},co_rgb:0f172a,b_white,bo_25px_solid_white,r_12,g_south_west,x_60,y_60`;

    // 3. Price Tag (Levitating)
    // Pink #E11D48
    // Rotated -3deg (a_-3)
    // Position: Above Info Box. y_150 puts it overlapping the top of info box slightly (visual trick) or just above.
    // Text: 60px Black (Extra Bold)
    // Background: Pink
    // Border: Pink (padding)
    // Rounding: r_8
    const priceLayer = `l_text:${font}_60_black:${priceText},co_white,b_rgb:E11D48,bo_20px_solid_rgb:E11D48,r_8,a_-3,g_south_west,x_60,y_150`;

    // 4. Sub-Title (Small, Uppercase)
    // Above Price. y_290
    // Color: Slate-300 (rgb:cbd5e1) or White
    const subTitleLayer = `l_text:${font}_24_bold:${subTitleText},co_white,g_south_west,x_60,y_280`;

    // 5. Main Title (Huge, Black/Heavy)
    // Above Sub-Title. y_320
    const mainTitleLayer = `l_text:${font}_75_black:${mainTitleText},w_900,c_fit,co_white,g_south_west,x_60,y_320`;

    // 6. Logo (Top Left)
    // "Flugi.cz" + Plane
    // Larger font (40) and Bold/Black
    // Unicode Plane: ✈
    const logoLayer = `l_text:${font}_40_black:✈%20Flugi.cz,co_white,g_north_west,x_50,y_50`;

    // --- Assembly ---
    const layers = [
        baseConfig,
        effectConfig,
        logoLayer,
        infoBoxLayer,
        priceLayer,
        subTitleLayer,
        mainTitleLayer
    ].filter(Boolean).join('/');

    return `https://res.cloudinary.com/${cloudName}/image/fetch/${layers}/${imageUrl}`;
}
