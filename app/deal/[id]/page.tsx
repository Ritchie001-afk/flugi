import { BentoGallery } from '@/components/BentoGallery';
import { Amenities } from '@/components/Amenities';
import { Button } from '@/components/ui/Button';
import { ItineraryGenerator } from '@/components/ItineraryGenerator';
import { getDestinationImage } from '@/lib/images';
import { AFFILIATE_LINKS, getBookingUrl, getAirbnbUrl, getRentalcarsUrl } from '@/lib/affiliates';
import { ArrowLeft, ArrowRight, MapPin, Calendar, ExternalLink, Bed, Car, Home, Plane, Ticket, ShieldCheck } from 'lucide-react';
import { ShareButtons } from '@/components/ShareButtons';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface DealPageProps {
    params: {
        id: string;
    };
}

export default async function DealPage({ params }: DealPageProps) {
    const { id } = await params;

    const deal = await prisma.deal.findUnique({
        where: { id },
    });

    if (!deal) {
        notFound();
    }

    const destinationCity = deal.destinationCity || deal.destination.split(',')[0];
    const images = deal.images && deal.images.length > 0 ? deal.images : [deal.image];

    // Normalize type check (Handle English 'flight', Czech 'letenka', etc.)
    const rawType = deal.type?.toLowerCase().trim() || '';
    const isFlight = rawType === 'flight' || rawType === 'letenka' || rawType.includes('let');

    return (
        <main className="min-h-screen bg-white pb-20">
            {/* Header / Nav */}
            <div className="border-b border-slate-100 bg-white sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="inline-flex items-center text-slate-600 hover:text-blue-600 transition-colors font-medium">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Zpět na nabídky
                    </Link>
                    <div className="font-bold text-slate-900 truncate max-w-[200px] md:max-w-none ml-4 hidden md:block">
                        {deal.title}
                    </div>
                    <div className="ml-auto flex gap-2">
                        <ShareButtons title={deal.title} />
                    </div>
                </div>
            </div>

            {/* New Gallery Component */}
            <BentoGallery
                images={images}
                title={deal.title}
                destination={deal.destination}
                price={deal.price}
            />

            <div className="container mx-auto px-4 mt-8 md:mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* Description */}
                        <div className="prose prose-slate max-w-none">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4 hidden md:block">O zájezdu</h2>
                            <p className="text-lg leading-relaxed text-slate-600">{deal.description}</p>
                        </div>

                        {/* Amenities Grid - Hide for flights */}
                        {!isFlight && (
                            <div className="border-t border-slate-100 pt-8">
                                <Amenities text={deal.description} tags={deal.tags} type={deal.type} />
                            </div>
                        )}

                        {/* Reviews (Only for packages/hotels) */}
                        {!isFlight && (
                            <div className="border-t border-slate-100 pt-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold text-slate-900">Hodnocení hostů</h3>
                                    {deal.rating && (
                                        <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold">
                                            ★ {deal.rating}/10
                                        </div>
                                    )}
                                </div>
                                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col md:flex-row gap-6 items-center text-center md:text-left">
                                    <div className="flex-1">
                                        <p className="text-slate-600 italic">"Skvělá dovolená, hotel odpovídal popisu. Jídlo vynikající a pláž čistá."</p>
                                        <div className="mt-2 font-bold text-slate-900">– Jana, ověřený zákazník</div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <a href={deal.reviewUrl || '#'} target="_blank" className="text-blue-600 text-sm font-medium hover:underline">
                                            Číst recenze na {deal.reviewSource || 'TripADvisor'} →
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* AI Itinerary */}
                        <div className="border-t border-slate-100 pt-8">
                            <ItineraryGenerator destination={deal.destinationCity || deal.destination} length={7} />
                        </div>

                        {/* GetYourGuide Upsell */}
                        <div className="border-t border-slate-100 pt-8 pb-8">
                            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8 border border-orange-100">
                                <div className="flex md:items-center justify-between flex-col md:flex-row gap-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-orange-900 flex items-center gap-2">
                                            <Ticket className="h-5 w-5" />
                                            Nudit se nebudete!
                                        </h3>
                                        <p className="text-orange-800/80 mt-2">
                                            Objevte nejlepší zážitky, výlety a vstupenky v destinaci {destinationCity}.
                                        </p>
                                    </div>
                                    <a
                                        href={`https://www.getyourguide.com/s/?q=${encodeURIComponent(destinationCity)}&partner_id=YOUR_PARTNER_ID`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 w-full md:w-auto">
                                            Zobrazit aktivity na GYG
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Google Map (Main Column) */}
                        <div className="border-t border-slate-100 pt-8 pb-8">
                            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-slate-600" /> Mapa destinace
                            </h3>
                            <div className="bg-slate-50 rounded-2xl overflow-hidden h-[400px] border border-slate-200 shadow-sm">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    allowFullScreen
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(destinationCity)}&t=&z=11&ie=UTF8&iwloc=&output=embed`}
                                    title="Mapa destinace"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
                                <div className="flex justify-between items-end mb-6">
                                    <div className="text-slate-500 text-sm">Cena za osobu</div>
                                    <div className="text-3xl font-extrabold text-blue-600">{deal.price.toLocaleString('cs-CZ')} Kč</div>
                                </div>

                                {deal.startDate && deal.endDate && (
                                    <div className="bg-blue-50 rounded-lg p-3 mb-6 flex items-center justify-between">
                                        <div className="flex items-center text-blue-800 font-medium">
                                            <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                                            <span>Termín cesty</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-slate-900">
                                                {new Date(deal.startDate).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric' })}
                                                {' - '}
                                                {new Date(deal.endDate).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' })}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {Math.ceil((new Date(deal.endDate).getTime() - new Date(deal.startDate).getTime()) / (1000 * 60 * 60 * 24))} dní
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <a href={deal.url} target="_blank" rel="noopener noreferrer" className="block mb-3">
                                    <Button size="lg" className="w-full h-14 text-lg font-bold shadow-lg shadow-blue-600/20">
                                        Rezervovat termín
                                    </Button>
                                </a>

                                <div className="text-center text-xs text-slate-400 mb-6">
                                    {isFlight && (
                                        <div className="flex items-center text-slate-600 text-sm">
                                            <Plane className="h-4 w-4 mr-3 text-slate-400" />
                                            <span>{deal.airline || 'Letecká společnost'}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center text-slate-600 text-sm">
                                        <Calendar className="h-4 w-4 mr-3 text-slate-400" />
                                        <span>Dostupné termíny ověřte u prodejce</span>
                                    </div>
                                </div>
                            </div>

                            {/* Flight Details Box (Sidebar) */}
                            {isFlight && (
                                <div className="bg-white rounded-2xl p-6 shadow-xl shadow-blue-900/5 border border-blue-100 mt-6 mt-6">
                                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <Plane className="h-4 w-4 text-blue-600" /> Detaily letu
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500">Letecká společnost</span>
                                            <span className="font-medium text-slate-900">{deal.airline || '-'}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500">Přestupy</span>
                                            <span className="font-medium text-slate-900">
                                                {deal.transferCount === 0 ? 'Přímý let' : `${deal.transferCount} přestupů`}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500">Zavazadla</span>
                                            <span className="font-medium text-slate-900">{deal.baggageInfo || 'Dle tarifu'}</span>
                                        </div>
                                        {deal.entryRequirements && (() => {
                                            // Simple URL extraction logic
                                            const urlRegex = /(https?:\/\/[^\s]+)/g;
                                            const match = deal.entryRequirements.match(urlRegex);
                                            const url = match ? match[0] : null;
                                            const text = deal.entryRequirements.replace(urlRegex, '').replace(/Více info:/i, '').trim();

                                            return (
                                                <div className="pt-3 border-t border-slate-100">
                                                    <span className="block text-xs font-bold text-slate-500 uppercase mb-1">Vstupní podmínky</span>
                                                    <div className="flex flex-col gap-2">
                                                        <span className="text-sm text-slate-700">{text}</span>
                                                        {url && (
                                                            <a
                                                                href={url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-2 py-1.5 rounded-lg self-start transition-colors hover:bg-blue-100"
                                                            >
                                                                <ExternalLink className="h-3 w-3 mr-1" />
                                                                Oficiální info (MZV)
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
                            )}

                            {/* Cross-sell Sidebar Cards */}
                            <div className="space-y-6">
                                {deal.type === 'package' ? (
                                    <div className="bg-white rounded-xl border border-green-100 p-4 shadow-sm">
                                        <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-green-600" /> Tipy na výlety
                                        </h4>
                                        <a href={`https://www.tripadvisor.com/Search?q=${encodeURIComponent(deal.destination)}`} target="_blank" rel="noopener noreferrer" className="block group">
                                            <div className="p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors flex items-center gap-3">
                                                <div className="p-2 bg-green-600 rounded-lg text-white">
                                                    <MapPin className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-green-900 text-sm group-hover:underline">Recenze a tipy</h4>
                                                    <p className="text-xs text-green-700">TripAdvisor</p>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                ) : null}

                                {/* Accommodation Links (Booking / Airbnb) */}
                                <div className="bg-white rounded-xl border border-blue-100 p-4 shadow-sm">
                                    <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                        <Bed className="h-4 w-4 text-blue-600" /> Kde se ubytovat?
                                    </h4>
                                    <div className="space-y-3">
                                        <a href={getBookingUrl(destinationCity)} target="_blank" rel="noopener noreferrer" className="block group">
                                            <div className="p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors flex items-center gap-3">
                                                <div className="p-2 bg-blue-600 rounded-lg text-white">
                                                    <Bed className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-blue-900 text-sm group-hover:underline">{AFFILIATE_LINKS.booking.name}</h4>
                                                    <p className="text-xs text-blue-700">{AFFILIATE_LINKS.booking.cta}</p>
                                                </div>
                                            </div>
                                        </a>
                                        <a href={getAirbnbUrl(destinationCity)} target="_blank" rel="noopener noreferrer" className="block group">
                                            <div className="p-3 rounded-lg bg-rose-50 hover:bg-rose-100 transition-colors flex items-center gap-3">
                                                <div className="p-2 bg-rose-500 rounded-lg text-white">
                                                    <Home className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-rose-900 text-sm group-hover:underline">{AFFILIATE_LINKS.airbnb.name}</h4>
                                                    <p className="text-xs text-rose-700">{AFFILIATE_LINKS.airbnb.cta}</p>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </div>

                                {/* Transport & Insurance buttons (Sidebar) */}
                                <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm space-y-4">
                                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                        <Car className="h-4 w-4 text-slate-600" /> Doprava a služby
                                    </h4>

                                    {/* Buttons Grid */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <a href={getRentalcarsUrl(destinationCity)} target="_blank" rel="noopener noreferrer" className="block group">
                                            <div className="p-3 h-full rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors flex flex-col items-center text-center gap-2">
                                                <div className="p-2 bg-orange-500 rounded-lg text-white">
                                                    <Car className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-orange-900 text-xs leading-tight group-hover:underline">Půjčovna aut</h4>
                                                </div>
                                            </div>
                                        </a>

                                        <a href="https://www.top-pojisteni.cz/cestovni-pojisteni/kalkulacka" target="_blank" rel="noopener noreferrer" className="block group">
                                            <div className="p-3 h-full rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors flex flex-col items-center text-center gap-2">
                                                <div className="p-2 bg-indigo-500 rounded-lg text-white">
                                                    <ShieldCheck className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-indigo-900 text-xs leading-tight group-hover:underline">Pojištění</h4>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}
