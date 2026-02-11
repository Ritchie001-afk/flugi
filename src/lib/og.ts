
import { getDestinationImage } from '@/lib/images';

export function getCloudinaryOgUrl(deal: any): string {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'flugi';

    // 1. Get Base Image
    let imageUrl = getDestinationImage(deal.destination, deal.image);

    if (imageUrl.startsWith('/')) {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.flugi.cz';
        imageUrl = `${baseUrl}${imageUrl}`;
    }

    const font = 'Montserrat';

    // --- Data Prep ---
    // Title Split
    const subTitle = (deal.type === 'flight' ? 'AKČNÍ LETENKA' : 'AKČNÍ ZÁJEZD');
    const mainTitle = deal.title.toUpperCase(); // e.g. "Z KRAKOWA DO BOMBAJE..."

    const subTitleText = encodeURIComponent(subTitle);
    const mainTitleText = encodeURIComponent(mainTitle);

    // Price
    const priceFormatted = new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(deal.price);
    const priceText = encodeURIComponent(priceFormatted);

    // Info Box Lines
    // Icons: Using Unicode characters that are widely supported in fonts.
    // Calendar: 📅 (might be risky if font doesn't support). 
    // Plane: ✈️
    // User requested icons. Let's try explicit emojis. 
    // If they fail, we fallback to text labels? No, user explicitly asked for icons.
    let infoLines = [];
    if (deal.startDate && deal.endDate) {
        try {
            const start = new Date(deal.startDate);
            const end = new Date(deal.endDate);
            const fmt = (d: Date) => `${d.getDate()}.${d.getMonth() + 1}.`;
            infoLines.push(`📅 ${fmt(start)} – ${fmt(end)} ${end.getFullYear()}`);
        } catch (e) { }
    }
    if (deal.airline) {
        infoLines.push(`✈️ ${deal.airline}`);
    }

    const infoText = encodeURIComponent(infoLines.join('     ') || '📅 Termín na vyžádání');


    // --- Layer Definitions ---

    // 1. Background Config
    // Background color: Dark Blue #001529
    // Image effect: Fade to transparent on the LEFT side (West).
    // This reveals the background color behind the text.
    // e_gradient_fade:0.5,g_west means "start fading from west edge to 50% width"? 
    // Actually, gradient_fade fades the image OUT. 
    // We want left side to be transparent (showing background).
    const baseConfig = 'c_fill,h_630,q_auto,w_1200,b_rgb:001529';
    const gradientEffect = 'e_gradient_fade,x_0.5,g_west';
    // Note: If g_west is start, left side disappears. Perfect.

    // 2. Info Box (Bottom Left)
    // Bigger Font (30), Bigger Padding (40px)
    // Position: y_50 (bottom)
    const infoBoxLayer = `l_text:${font}_30_bold:${infoText},co_rgb:0f172a,b_white,bo_40px_solid_white,r_25,g_south_west,x_60,y_50`;

    // 3. Price Tag ("Levitating")
    // Brighter Pink: #FF0060 (Hot Pink) or #E11D48 (Rose-600)
    // User complaint: "Tmavá červená". 
    // Let's go slightly brighter/richer: #F43F5E (Rose-500) or #FF0055.
    // Let's stick to brand #E11D48 but ensure it's on white text.
    // Rotation: -3deg.
    // Shadow: Strong drop shadow.
    // Position: Overlapping Info Box.
    // InfoBox top is roughly y_50 + height (~80). Price needs to be at y_160?

    // Styling:
    // Text: White. Background: Pink. Border: Pink (padding).
    // Radius: 10px.
    // Effect: Rotation + Shadow.
    // Syntax: .../fl_layer_apply,a_-3,e_shadow:50...
    const priceColor = 'E11D48';
    const priceLayer = `l_text:${font}_65_black:${priceText},co_white,b_rgb:${priceColor},bo_30px_solid_rgb:${priceColor},r_15/fl_layer_apply,a_-3,e_shadow:60,x_15,y_15,co_rgb:00000090,g_south_west,x_40,y_180`;
    // Increased y from 150 to 180 to clear the larger Info Box.

    // 4. Sub-Title
    // Above Price. Price top is roughly y_180 + height (~100) = 280?
    // Let's set Subtitle y_340.
    const subTitleLayer = `l_text:${font}_26_bold:${subTitleText},co_rgb:cbd5e1,g_south_west,x_60,y_340`;

    // 5. Main Title
    // Above Subtitle. y_380.
    // Max Width constrained to 800px to avoid text overlapping Logo.
    // Font size 75.
    // If it wraps to 2 lines, it grows UP from 380? 
    // Yes, g_south_west anchors bottom-left.
    // So 380 + height. 
    // Wait. If y is offset from bottom, y_380 is HIGHER than y_50.
    // Top of image is y_630.
    // Logo is at y_50 from TOP (g_north_west). equivalent to y_580 from bottom.
    // We have 200px gap (580 - 380).
    // Title height? 75px * 2 lines = 150px.
    // It should fit!
    const mainTitleLayer = `l_text:${font}_75_black:${mainTitleText},c_fit,w_900,co_white,g_south_west,x_60,y_380`;

    // 6. Logo (Top Left)
    // Larger Font (45).
    // Unicode Plane: ✈
    const logoLayer = `l_text:${font}_45_black:✈%20Flugi.cz,co_white,g_north_west,x_50,y_50`;

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

    return `https://res.cloudinary.com/${cloudName}/image/fetch/${layers}/${imageUrl}`;
}
