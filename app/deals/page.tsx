
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Search, Filter, Plane, Calendar, MapPin } from "lucide-react";
import prisma from "@/lib/db";
import { getDestinationImage } from "@/lib/images";

export const dynamic = 'force-dynamic';

// This is a Server Component
export default async function DealsPage() {
    const deals = await prisma.deal.findMany({
        where: {
            expiresAt: { gt: new Date() }
        },
        orderBy: [
            { isFlashDeal: 'desc' },
            { createdAt: 'desc' }
        ]
    });

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 pt-24 pb-24">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
                    Všechny nabídky
                </h1>
                <p className="text-slate-600 mb-12 max-w-2xl">
                    Projděte si náš ručně vybraný výběr nejlevnějších letenek a nejlepších dovolených dostupných právě teď.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Filters - Keeping static for now, functional enhancement later */}
                    <aside className="space-y-8">
                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                    <Filter className="h-4 w-4" /> Filtrování
                                </h3>
                                <button className="text-xs text-blue-600 hover:text-blue-500">Resetovat</button>
                            </div>

                            {/* Price Range */}
                            <div className="space-y-4 mb-6">
                                <h4 className="text-sm font-medium text-slate-700">Cenové rozpětí</h4>
                                <div className="flex items-center gap-2">
                                    <input type="number" placeholder="Od" className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-900 focus:border-blue-500 outline-none" />
                                    <span className="text-slate-400">-</span>
                                    <input type="number" placeholder="Do" className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-900 focus:border-blue-500 outline-none" />
                                </div>
                            </div>

                            {/* Destinations */}
                            <div className="space-y-4 mb-6">
                                <h4 className="text-sm font-medium text-slate-700">Destinace</h4>
                                <div className="space-y-2">
                                    {['Evropa', 'Asie', 'Severní Amerika', 'Afrika'].map(region => (
                                        <label key={region} className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 cursor-pointer group">
                                            <div className="w-4 h-4 rounded border border-slate-300 bg-white group-hover:border-blue-500 transition-colors"></div>
                                            {region}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <Button className="w-full" variant="secondary">Použít filtry</Button>
                        </div>
                    </aside>

                    {/* Deals Grid */}
                    <div className="lg:col-span-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                                </div>
                                            </div>

                                            <div className="space-y-2 mb-6">
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <MapPin className="h-3 w-3" />
                                                    <span>{deal.destination}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>7 dní (přibližně)</span>
                                                </div>
                                            </div>

                                            <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                                <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                                                    {deal.type === 'flight' ? 'Pelikan.cz' : 'Invia.cz'}
                                                </div>
                                                <Link href={`/deal/${deal.id}`}>
                                                    <Button size="sm" variant="outline" className="h-8 text-xs border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600">
                                                        Zobrazit
                                                    </Button>
                                                </Link>
                                            </div>
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
