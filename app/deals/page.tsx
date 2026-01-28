
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Search, Filter, Plane, Calendar, MapPin } from "lucide-react";
import prisma from "@/lib/db";
import { getDestinationImage } from "@/lib/images";
import { Amenities } from "@/components/Amenities";

export const dynamic = 'force-dynamic';

// This is a Server Component
export default async function DealsPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const searchParams = await props.searchParams;

    // Parse filters
    const destination = typeof searchParams.destination === 'string' ? searchParams.destination : undefined;
    const minPrice = typeof searchParams.minPrice === 'string' ? parseFloat(searchParams.minPrice) : undefined;
    const maxPrice = typeof searchParams.maxPrice === 'string' ? parseFloat(searchParams.maxPrice) : undefined;
    const tags = typeof searchParams.tags === 'string' ? searchParams.tags.split(',') : undefined;
    const type = typeof searchParams.type === 'string' ? searchParams.type : undefined;

    // Build Prisma Query
    const where: any = {
        OR: [
            { expiresAt: { gt: new Date() } },
            { expiresAt: null }
        ]
    };

    if (type) {
        where.type = type;
    }

    if (destination) {
        where.destination = { contains: destination, mode: 'insensitive' };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {};
        if (minPrice !== undefined) where.price.gte = minPrice;
        if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (tags && tags.length > 0) {
        where.tags = { hasSome: tags };
    }

    const deals = await prisma.deal.findMany({
        where,
        orderBy: [
            { isFlashDeal: 'desc' },
            { createdAt: 'desc' }
        ]
    });

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 pt-24 pb-24">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-4">
                            {type === 'flight' ? 'Akční Letenky' : type === 'package' ? 'Zájezdy a Dovolená' : 'Všechny nabídky'}
                        </h1>
                        <p className="text-slate-600 max-w-2xl">
                            {type === 'flight'
                                ? 'Nejlevnější letenky do celého světa, které jsme pro vás našli.'
                                : type === 'package'
                                    ? 'Kompletní balíčky dovolené s ubytováním za nejlepší ceny.'
                                    : 'To nejlepší z letenek a zájezdů na jednom místě.'}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Filters - Hidden per user request */}
                    {/* <aside className="space-y-8">
                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                           ...
                        </div>
                    </aside> */}

                    {/* Deals Grid - Full Width */}
                    <div className="col-span-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {deals.length === 0 ? (
                                <div className="col-span-full py-12 text-center text-slate-500">
                                    <p>Zatím žádné nabídky. Zkuste to později.</p>
                                </div>
                            ) : (
                                deals.map((deal: any) => (
                                    <div key={deal.id} className="group flex flex-col rounded-2xl bg-white border border-slate-200 overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all duration-300">

                                        {/* Image */}
                                        <div className="relative aspect-video bg-slate-200 overflow-hidden">
                                            {/* Smart Image Selection */}
                                            <img
                                                src={getDestinationImage(deal.destination, deal.image)}
                                                alt={deal.title}
                                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                                                loading="lazy"
                                            />

                                            <div className="absolute top-3 left-3 flex gap-2">
                                                <span className="px-2 py-1 bg-white/80 backdrop-blur-md rounded-md text-xs font-bold text-slate-900 border border-white/20 shadow-sm">
                                                    Last Minute
                                                </span>
                                                {deal.isFlashDeal && <span className="px-2 py-1 bg-blue-600 rounded-md text-xs font-bold text-white shadow-sm">Top</span>}
                                                {deal.originalPrice && deal.originalPrice > deal.price && (
                                                    <span className="px-2 py-1 bg-red-500 rounded-md text-xs font-bold text-white shadow-sm">
                                                        -{Math.round((1 - deal.price / deal.originalPrice) * 100)}%
                                                    </span>
                                                )}
                                                {deal.rating && deal.type !== 'flight' && (
                                                    <span className="px-2 py-1 bg-yellow-400 rounded-md text-xs font-bold text-white shadow-sm flex items-center gap-1">
                                                        ★ {deal.rating}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-5 flex-1 flex flex-col">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                    {deal.title}
                                                </h3>
                                                <div className="text-right whitespace-nowrap ml-2">
                                                    <span className="block text-xl font-bold text-slate-900">{deal.price.toLocaleString('cs-CZ')} Kč</span>
                                                    {deal.originalPrice && deal.originalPrice > deal.price && (
                                                        <span className="text-xs text-slate-400 line-through">{deal.originalPrice.toLocaleString('cs-CZ')} Kč</span>
                                                    )}
                                                    {deal.startDate && deal.endDate && (
                                                        <div className="mt-1">
                                                            <span className="text-xs text-slate-500 block">
                                                                {new Date(deal.startDate).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric' })}
                                                                {' - '}
                                                                {new Date(deal.endDate).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' })}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-3 flex justify-center">
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <MapPin className="h-3 w-3" />
                                                <span>{deal.destination}</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-slate-100">
                                            <Amenities text={deal.description || ''} tags={deal.tags} type={deal.type} variant="compact" />
                                        </div>

                                        <div className="mt-auto px-5 pb-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                                            <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                                                {/* Provider text removed */}
                                            </div>
                                            <Link href={`/deal/${deal.slug || deal.id}`}>
                                                <Button size="sm" variant="outline" className="h-9 text-xs border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 px-4">
                                                    Zobrazit
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Pagination / Load More */}
                        <div className="mt-12 text-center">
                            <Button variant="ghost" size="lg" className="text-slate-500 hover:text-blue-600">
                                Načíst další nabídky
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
