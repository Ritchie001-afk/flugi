
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
    const mainTitle = deal.title.toUpperCase().replace('Z ', '').replace('ODLET Z ', ''); // Try to shorten generic prefixes?
    // User want: "Z VÍDNĚ DO DŽIDDY" -> Full title is fine.
    const strictMainTitle = deal.title.toUpperCase();

    const priceFormatted = new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(deal.price);
    const priceText = encodeURIComponent(priceFormatted);

    // Info Box Content
    // We need separate lines for the "List" look.
    // ✈️ Odkud: ...
    // 📍 Kam: ...
    // 📅 Termín: ...
    // 💺 Aerolinka: ...

    // We can't do complex alignment (columns) in a single text layer nicely.
    // But we can join with newlines.

    const fmtRef = (d: string) => {
        try {
            const date = new Date(d);
            return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
        } catch { return ''; }
    };

    const dateStr = (deal.startDate && deal.endDate)
        ? `${fmtRef(deal.startDate)} – ${fmtRef(deal.endDate)}`
        : 'Na vyžádání';

    // Determining Origin/Destination from title is hard if not in DB.
    // deal object might not have 'origin'. 
    // We will use generic "Praha / Vídeň" if unknown? No, strictly what we have.
    // deal.destination is usually "Město, Země".
    const destinationStr = deal.destination || 'Neznámá destinace';

    // Safe Emojis (trying standard ones)
    // ✈️ \u2708\uFE0F
    // 📍 \uD83D\uDCCD
    // 📅 \uD83D\uDCC5
    // 💺 \uD83D\uDCBA

    const lines = [
        `✈️ Odkud: Vídeň / Praha (Dle akce)`, // Placeholder if origin missing
        `📍 Kam: ${destinationStr}`,
        `📅 Termín: ${dateStr}`,
        `💺 Aerolinka: ${deal.airline || 'Letecky'}`
    ];

    const infoText = encodeURIComponent(lines.join('\n'));
    // Note: Line spacing in Cloudinary text can be tight. line_spacing param might be needed.


    // --- Layer Definitions (Master Design) ---

    // 1. Background (The Container)
    // Blue Background: #0056b3
    // Image: Fades to transparent on the LEFT side (Gradient Left->Right).
    // e_gradient_fade,x_0.5,g_east ??
    // Let's test: b_rgb:0056b3.
    // If we apply e_gradient_fade to the image on the background... 
    // We want image visible on Right. Transparent on Left.
    // So fade starts from Left. g_west.
    const baseConfig = 'c_fill,h_630,q_auto,w_1200,b_rgb:0056b3';
    const gradientEffect = 'e_gradient_fade,x_0.6,g_west';
    // This makes left 60% fade out? No, x sets the LENGTH of the fade?
    // Usually x_0.5 means fade spans 50% of image.
    // We want almost hard cut or smooth transition? User said "Linear Gradient".
    // Valid Cloudinary approach: Use a gradient image overlay?
    // Or strong vignette.
    // Let's stick to gradient_fade,x_0.5,g_west which worked before.

    // 2. Logo (Top Left)
    // x_60, y_50. Font weight 800.
    const logoLayer = `l_text:${font}_35_heavy:Flugi.cz,co_white,g_north_west,x_60,y_50`;

    // 3. Titles (Left Column)
    // Headline "AKČNÍ LETENKA"
    // y_120
    const subTitleLayer = `l_text:${font}_30_black:${encodeURIComponent(subTitle)},co_white,g_north_west,x_60,y_130`;

    // Main Destination "Z VÍDNĚ DO..."
    // Large, Black weight (900). 
    // y_170
    const mainTitleLayer = `l_text:${font}_60_black:${encodeURIComponent(strictMainTitle)},w_700,c_fit,co_white,g_north_west,x_60,y_170,line_spacing_-10`;

    // 4. Price Tag (The Pink Tag)
    // Position: Between Title and Info Box.
    // Titles end around y_170 + height (~150) = ~320.
    // Info Box starts around y_450? 
    // Let's place Price at y_340 (from top).
    // Color: #E11D48. Rotation: -4deg.
    // Shadow: e_shadow:35.
    // Visual: Icon (hole)? Hard to draw.
    // Just create a nice rounded box.
    const priceLayer = `l_text:${font}_55_black:${priceText},co_white,b_rgb:E11D48,bo_25px_solid_rgb:E11D48,r_15/fl_layer_apply,a_-4,e_shadow:50,x_10,y_15,co_black,g_north_west,x_60,y_340`;

    // 5. Info Box (The White Card)
    // Position: Bottom Left. 
    // To mimic "width 65%", we set w_700.
    // White background. Rounded r_20.
    // Text color: Dark (#0f172a).
    // We need TWO layers:
    // A. The White Box Background.
    // B. The Content.
    // Why? Text layer background size depends on text. We want a fixed/larger card look?
    // Actually, user said "Width 80-90% of left column".
    // Text with b_white works if we padd it enough.

    // Text: Dark Blue/Black. Left aligned.
    // y_460 (below price).
    const infoContentLayer = `l_text:${font}_24_bold:${infoText},co_rgb:0f172a,b_white,bo_30px_solid_white,r_20,line_spacing_15,g_north_west,x_60,y_460,w_600,c_fit`;
    // Added line_spacing_15 for readability.
    // w_600 constrains text width.

    // --- Assembly ---
    // Note: Using g_north_west for everything to ensure strict top-down layout matching the "Left Column" spec.

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
