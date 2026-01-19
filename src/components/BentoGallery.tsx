import Image from 'next/image';
import { MapPin } from 'lucide-react';

interface BentoGalleryProps {
    images: string[];
    title: string;
    destination: string;
    price: number;
}

export function BentoGallery({ images, title, destination, price }: BentoGalleryProps) {
    // Ensure we have at least 5 images for the grid (fill with placeholders/duplicates if needed)
    // In a real app, we would fetch diverse generic images for the destination
    // For now, we cycle through the provided ones or use a fallback
    const displayImages = images.slice(0, 5);
    const count = displayImages.length;

    if (count === 0) return null;

    return (
        <div className="relative w-full max-w-7xl mx-auto md:pt-6 md:px-6">
            {/* Gallery Grid - Dynamic based on count */}
            <div className={`grid gap-2 h-[50vh] min-h-[400px] ${count === 1 ? 'grid-cols-1' :
                    count === 2 ? 'grid-cols-2' :
                        count === 3 ? 'grid-cols-2 md:grid-cols-3' :
                            'grid-cols-1 md:grid-cols-4 md:grid-rows-2'
                }`}>

                {/* Main Large Image - Always First */}
                <div className={`relative rounded-2xl overflow-hidden group ${count === 1 ? 'col-span-1' :
                        count === 2 ? 'col-span-1' :
                            count === 3 ? 'col-span-2' :
                                'col-span-2 row-span-2' // Standard layout for 4+ images
                    }`}>
                    <Image
                        src={displayImages[0]}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />

                    {/* Mobile Only Overlay */}
                    <div className="absolute bottom-4 left-4 text-white md:hidden">
                        <div className="flex items-center text-sm font-medium mb-1">
                            <MapPin className="h-3 w-3 mr-1" /> {destination}
                        </div>
                        <h1 className="text-2xl font-bold leading-tight">{title}</h1>
                    </div>
                </div>

                {/* Additional Images */}
                {count > 1 && displayImages.slice(1).map((img, idx) => (
                    <div key={idx} className={`hidden md:block relative rounded-2xl overflow-hidden group ${
                        // Layout Logic for secondary images
                        count === 3 && idx === 1 ? 'col-span-1 row-span-1' : ''
                        }`}>
                        <Image
                            src={img}
                            alt={`${destination} ${idx + 2}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />

                        {/* Show "View Gallery" on the LAST item */}
                        {idx === count - 2 && (
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center cursor-pointer">
                                <span className="text-white font-bold border border-white/30 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white/20 transition-all">
                                    {count > 4 ? `+${images.length - 4} dalších` : 'Zobrazit galerii'}
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Title Overlay for Desktop (Outside Grid) */}
            <div className="hidden md:flex justify-between items-end mt-6 mb-2">
                <div>
                    <div className="flex items-center text-blue-600 font-bold mb-1">
                        <MapPin className="h-4 w-4 mr-1" /> {destination}
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
                </div>
                <div className="text-right">
                    <div className="text-sm text-slate-500 font-medium">Cena za osobu</div>
                    <div className="text-4xl font-bold text-blue-600">{price.toLocaleString('cs-CZ')} Kč</div>
                </div>
            </div>
        </div>
    );
}
