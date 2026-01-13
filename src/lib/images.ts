
// Map of destinations to high-quality Unsplash images
const DESTINATION_IMAGES: Record<string, string> = {
    // Cities
    'londýn': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1470&auto=format&fit=crop',
    'paříž': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1473&auto=format&fit=crop',
    'dubaj': 'https://images.unsplash.com/photo-1512453979798-5ea9ba6a80f4?q=80&w=1471&auto=format&fit=crop',
    'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1470&auto=format&fit=crop',
    'barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=1470&auto=format&fit=crop',
    'řím': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1396&auto=format&fit=crop',
    'milán': 'https://images.unsplash.com/photo-1621535942475-433b93405c1d?q=80&w=1470&auto=format&fit=crop',
    'benátky': 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?q=80&w=1470&auto=format&fit=crop',
    'amsterdam': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=1470&auto=format&fit=crop',
    'prague': 'https://images.unsplash.com/photo-1541849546-216549ae216d?q=80&w=1470&auto=format&fit=crop',
    'praha': 'https://images.unsplash.com/photo-1541849546-216549ae216d?q=80&w=1470&auto=format&fit=crop',
    'vídeň': 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?q=80&w=1472&auto=format&fit=crop',
    'budapešť': 'https://images.unsplash.com/photo-1565426873118-a1fb8da73188?q=80&w=1470&auto=format&fit=crop',

    // Countries/Resorts
    'turecko': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1471&auto=format&fit=crop',
    'egypt': 'https://images.unsplash.com/photo-1539650116455-29cb5587eb78?q=80&w=1471&auto=format&fit=crop',
    'maledivy': 'https://images.unsplash.com/photo-1514282401047-d7c43913cc3c?q=80&w=1470&auto=format&fit=crop',
    'thajsko': 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1439&auto=format&fit=crop',
    'španělsko': 'https://images.unsplash.com/photo-1543783207-fa88100d7549?q=80&w=1374&auto=format&fit=crop',
    'itálie': 'https://images.unsplash.com/photo-1529260830199-42c42dda5f29?q=80&w=1336&auto=format&fit=crop',
    'řecko': 'https://images.unsplash.com/photo-1560936304-4d8cd225859b?q=80&w=1470&auto=format&fit=crop',
    'chorvatsko': 'https://images.unsplash.com/photo-1555990538-dca8db1e4d02?q=80&w=1470&auto=format&fit=crop',
    'bulharsko': 'https://images.unsplash.com/photo-1532155297378-0199dcb75475?q=80&w=1470&auto=format&fit=crop',
};

export function getDestinationImage(destination: string, fallbackImage?: string): string {
    if (!destination) return fallbackImage || '';

    const normalized = destination.toLowerCase().trim();

    // 1. Exact match
    for (const [key, url] of Object.entries(DESTINATION_IMAGES)) {
        if (normalized.includes(key)) return url;
    }

    // 2. High-res fix for Pelikan thumbnails (try to guess larger image)
    if (fallbackImage && fallbackImage.includes('pelikan.sk/photos/')) {
        // Replace thumbnail logic - purely experimental, but harmless if it 404s (browser handles it, or we keep using it)
        // Actually, browser 404 is ugly. Better to use the known quality map.
        // Let's rely on the scraped image ONLY if we don't have a map match.
        return fallbackImage;
    }

    // 3. Fallback
    return fallbackImage || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1421&auto=format&fit=crop'; // Generic Travel
}
