import { Wifi, Waves, Snowflake, Utensils, Baby, Car, Plane, Coffee, Dumbbell, Flower2, MapPin } from 'lucide-react';

interface AmenitiesProps {
    text: string;    // Description text to search in
    tags: string[];  // Tags array
    type?: string;   // Deal type (flight/package)
    variant?: 'default' | 'compact';
}

export function Amenities({ text, tags, type, variant = 'default' }: AmenitiesProps) {
    const safeTags = Array.isArray(tags) ? tags : [];
    const safeText = text || '';
    const fullText = (safeText + ' ' + safeTags.join(' ')).toLowerCase();

    // Configuration of possible amenities
    const config = [
        { icon: Utensils, label: 'All Inclusive', keys: ['all inclusive', 'plná penze', 'snídaně', 'polopenze'], types: ['package', 'hotel'] },
        { icon: Wifi, label: 'Wi-Fi Zdarma', keys: ['wifi', 'wi-fi', 'internet'], types: ['package', 'hotel', 'flight'] },
        { icon: Snowflake, label: 'Klimatizace', keys: ['klimatizace', 'ac', 'air condition'], types: ['package', 'hotel'] },
        { icon: Waves, label: 'Bazén', keys: ['bazén', 'pool'], types: ['package', 'hotel'] },
        { icon: MapPin, label: 'Centrum', keys: ['centrum', 'center'], types: ['package', 'hotel'] },
        { icon: Baby, label: 'Pro rodiny', keys: ['rodina', 'děti', 'family', 'hřiště'], types: ['package', 'hotel'] },
        { icon: Dumbbell, label: 'Fitness', keys: ['fitness', 'posilovna'], types: ['package', 'hotel'] },
        { icon: Car, label: 'Parkování', keys: ['parkování', 'garáž'], types: ['package', 'hotel'] },
    ];

    // Filter active amenities
    const active = config.filter(item => {
        // If specific types are defined for amenity, check if deal type matches
        if (type && item.types && !item.types.includes(type)) return false;

        return item.keys.some(key => fullText.includes(key));
    });

    if (active.length === 0) return null;

    if (variant === 'compact') {
        return (
            <div className="w-full">
                <div className="flex flex-wrap gap-2">
                    {active.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50 border border-slate-100 text-slate-600">
                            <item.icon className="h-3.5 w-3.5 text-blue-500" />
                            <span className="text-xs font-medium whitespace-nowrap">{item.label}</span>
                        </div>
                    ))}
                    {active.length > 3 && (
                        <span className="text-xs text-slate-400 flex items-center">+{active.length - 3}</span>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="my-8">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Vybavení a služby</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {active.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
                        <item.icon className="h-5 w-5 text-blue-500" />
                        <span className="font-medium text-sm">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
