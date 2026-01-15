import { BentoGallery } from '@/components/BentoGallery';
import { Amenities } from '@/components/Amenities';
import { Button } from '@/components/ui/Button';
import { ItineraryGenerator } from '@/components/ItineraryGenerator';
import { getDestinationImage } from '@/lib/images';
import { AFFILIATE_LINKS, getBookingUrl, getAirbnbUrl, getRentalcarsUrl } from '@/lib/affiliates';
import { ArrowLeft, ArrowRight, MapPin, Calendar, ExternalLink, Bed, Car, Home, Plane, Ticket } from 'lucide-react';
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
    // Create an array of images. If deal.image is a single string, make it an array. 
    // If we had a gallery field in DB we would use it here.
    const images = [deal.image];

    return (
        <main className="min-h-screen bg-white pb-20">
            {/* Header / Nav */}
            <div className="border-b border-slate-100 bg-white sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="inline-flex items-center text-slate-600 hover:text-blue-600 transition-colors font-medium">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Zpět na nabídky
                    </Link>
                    <div className="font-bold text-slate-900 truncate max-w-[200px] md:max-w-none ml-4">
                        {deal.title}
                    </div>
                    <div className="ml-auto flex gap-2">
                        {/* Mobile Share/Save buttons could go here */}
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

                        {/* Amenities Grid */}
                        <div className="border-t border-slate-100 pt-8">
                            <Amenities text={deal.description} tags={deal.tags} />
                        </div>

                        {/* Reviews (Already Implemented) */}
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
                    </div>

                    {/* Sidebar / Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
                                <div className="flex justify-between items-end mb-6">
                                    <div className="text-slate-500 text-sm">Cena za osobu</div>
                                    <div className="text-3xl font-extrabold text-blue-600">{deal.price.toLocaleString('cs-CZ')} Kč</div>
                                </div>

                                <a href={deal.url} target="_blank" rel="noopener noreferrer" className="block mb-3">
                                    <Button size="lg" className="w-full h-14 text-lg font-bold shadow-lg shadow-blue-600/20">
                                        Rezervovat termín
                                    </Button>
                                </a>

                                <div className="text-center text-xs text-slate-400 mb-6">
                                    Přesměrování na stránku partnera ({deal.provider || 'CK'})
                                </div>

                                <div className="space-y-4 pt-6 border-t border-slate-100">
                                    <div className="flex items-center text-slate-600 text-sm">
                                        <Calendar className="h-4 w-4 mr-3 text-slate-400" />
                                        <span>Dostupné termíny ověřte u prodejce</span>
                                    </div>
                                    <div className="flex items-center text-slate-600 text-sm">
                                        <Plane className="h-4 w-4 mr-3 text-slate-400" />
                                        <span>Letenky v ceně (pokud je uvedeno)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Cross-sell Sidebar Cards */}
                            <div className="space-y-4">
                                {deal.type === 'package' ? (
                                    <a href={`https://www.tripadvisor.com/Search?q=${encodeURIComponent(deal.destination)}`} target="_blank" rel="noopener noreferrer" className="block group">
                                        <div className="p-4 rounded-xl bg-green-50 border border-green-100 hover:bg-green-100 transition-colors flex items-center gap-4">
                                            <div className="p-3 bg-green-600 rounded-lg text-white">
                                                <MapPin className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-green-900 group-hover:underline">Recenze a tipy</h4>
                                                <p className="text-xs text-green-700">Co vidět v okolí na TripAdvisoru</p>
                                            </div>
                                        </div>
                                    </a>
                                ) : (
                                    <>
                                        <a href={getBookingUrl(destinationCity)} target="_blank" rel="noopener noreferrer" className="block group">
                                            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors flex items-center gap-4">
                                                <div className="p-3 bg-blue-600 rounded-lg text-white">
                                                    <Bed className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-blue-900 group-hover:underline">{AFFILIATE_LINKS.booking.name}</h4>
                                                    <p className="text-xs text-blue-700">{AFFILIATE_LINKS.booking.cta}</p>
                                                </div>
                                            </div>
                                        </a>
                                        <a href={getAirbnbUrl(destinationCity)} target="_blank" rel="noopener noreferrer" className="block group">
                                            <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 hover:bg-rose-100 transition-colors flex items-center gap-4">
                                                <div className="p-3 bg-rose-500 rounded-lg text-white">
                                                    <Home className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-rose-900 group-hover:underline">{AFFILIATE_LINKS.airbnb.name}</h4>
                                                    <p className="text-xs text-rose-700">{AFFILIATE_LINKS.airbnb.cta}</p>
                                                </div>
                                            </div>
                                        </a>
                                    </>
                                )}

                                <a href={getRentalcarsUrl()} target="_blank" rel="noopener noreferrer" className="block group">
                                    <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 hover:bg-orange-100 transition-colors flex items-center gap-4">
                                        <div className="p-3 bg-orange-500 rounded-lg text-white">
                                            <Car className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-orange-900 group-hover:underline">{AFFILIATE_LINKS.rentalcars.name}</h4>
                                            <p className="text-xs text-orange-700">{AFFILIATE_LINKS.rentalcars.cta}</p>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}

