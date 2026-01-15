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
    const displayImages = [...images];
    while (displayImages.length < 5) {
        displayImages.push(images[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800');
    }

    return (
        <div className="relative w-full max-w-7xl mx-auto md:pt-6 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 h-[50vh] min-h-[400px]">
                {/* Main Large Image */}
                <div className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden group">
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

                {/* Secondary Images (Hidden on mobile usually, but we keep them here for desktop layout) */}
                <div className="hidden md:block relative rounded-2xl overflow-hidden group">
                    <Image src={displayImages[1]} alt={destination} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="hidden md:block relative rounded-2xl overflow-hidden group">
                    <Image src={displayImages[2]} alt={destination} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="hidden md:block relative rounded-2xl overflow-hidden group">
                    <Image src={displayImages[3]} alt={destination} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="hidden md:block relative rounded-2xl overflow-hidden group">
                    <Image src={displayImages[4]} alt={destination} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                    {/* View All Button Overlay */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center cursor-pointer">
                        <span className="text-white font-bold border border-white/30 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white/20 transition-all">
                            Zobrazit v galerii
                        </span>
                    </div>
                </div>
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
