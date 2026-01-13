
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import { Button } from '@/components/ui/Button';
import { ItineraryGenerator } from '@/components/ItineraryGenerator';
import { getDestinationImage } from '@/lib/images';
import { AFFILIATE_LINKS, getBookingUrl, getAirbnbUrl, getRentalcarsUrl } from '@/lib/affiliates';
import { ArrowLeft, ArrowRight, MapPin, Calendar, ExternalLink, Bed, Car, Home, Plane } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface DealPageProps {
    params: {
        id: string;
    };
}

export default async function DealPage({ params }: DealPageProps) {
    const { id } = await params; // Await params in Next.js 15+ (though 14 is fine too, safe to await)

    const deal = await prisma.deal.findUnique({
        where: { id },
    });

    if (!deal) {
        notFound();
    }

    const destinationCity = deal.destinationCity || deal.destination.split(',')[0];
    const displayImage = getDestinationImage(deal.destination, deal.image);

    return (
        <main className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Section */}
            <div className="relative h-[50vh] w-full bg-slate-900">
                <Image
                    src={displayImage}
                    alt={deal.title}
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
                    <div className="container mx-auto">
                        <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
                            <ArrowLeft className="h-4 w-4 mr-2" /> Zpět na nabídky
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 shadow-black drop-shadow-lg">
                            {deal.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-white/90">
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full">
                                <MapPin className="h-4 w-4" /> {deal.destination}
                            </div>
                            {deal.price > 0 && (
                                <div className="text-3xl font-bold text-blue-400 ml-auto">
                                    {deal.price.toLocaleString('cs-CZ')} Kč
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Description Card */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">O nabídce</h2>
                            <div className="prose prose-slate max-w-none text-slate-600">
                                <p>{deal.description}</p>
                                {/* Placeholder for more scraped content */}
                            </div>

                            <div className="mt-8 flex gap-4">
                                <a href={deal.url} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                                    <Button size="lg" className="w-full gap-2 text-lg px-8 shadow-xl shadow-blue-500/20">
                                        Rezervovat u prodejce <ExternalLink className="h-5 w-5" />
                                    </Button>
                                </a>
                                <Link href="/letiste/PRG" className="w-full sm:w-auto">
                                    <Button variant="outline" size="lg" className="w-full gap-2 text-lg px-8 border-slate-200 text-slate-600 hover:bg-slate-50">
                                        <Plane className="h-5 w-5" /> Průvodce letištěm
                                    </Button>
                                </Link>
                            </div>
                            <p className="text-xs text-slate-400 mt-4 text-center sm:text-left">
                                Budete přesměrováni na stránky {deal.type === 'flight' ? 'Pelikan.cz' : 'Invia.cz'} pro dokončení rezervace.
                            </p>
                        </div>

                        {/* AI Itinerary Generator */}
                        <ItineraryGenerator destination={destinationCity} />

                    </div>

                    {/* Sidebar / Cross-sell */}
                    <div className="space-y-6">

                        {/* Affiliate Cards */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-24">

                            {deal.type === 'package' ? (
                                <>
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">Kam na výlet</h3>
                                    {/* TripAdvisor */}
                                    <a href={`https://www.tripadvisor.cz/Search?q=${encodeURIComponent(destinationCity)}`} target="_blank" rel="noopener noreferrer" className="block group mb-4">
                                        <div className="p-4 rounded-xl bg-green-50 border border-green-100 hover:bg-green-100 transition-colors flex items-start gap-4">
                                            <div className="p-3 bg-green-600 rounded-lg text-white">
                                                <MapPin className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-green-900 group-hover:underline">Co vidět a zažít</h4>
                                                <p className="text-sm text-green-700 mb-2">Podívej se na nejlepší atrakce a restaurace v okolí na TripAdvisoru.</p>
                                                <span className="text-xs font-bold text-green-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                                                    Prozkoumat okolí <ArrowRight className="h-3 w-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">Najdi super ubytko</h3>

                                    {/* Booking */}
                                    <a href={getBookingUrl(destinationCity)} target="_blank" rel="noopener noreferrer" className="block group mb-4">
                                        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors flex items-start gap-4">
                                            <div className="p-3 bg-blue-600 rounded-lg text-white">
                                                <Bed className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-blue-900 group-hover:underline">{AFFILIATE_LINKS.booking.name}</h4>
                                                <p className="text-sm text-blue-700 mb-2">{AFFILIATE_LINKS.booking.description}</p>
                                                <span className="text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                                                    {AFFILIATE_LINKS.booking.cta} <ArrowRight className="h-3 w-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </a>

                                    {/* Airbnb */}
                                    <a href={getAirbnbUrl(destinationCity)} target="_blank" rel="noopener noreferrer" className="block group mb-4">
                                        <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 hover:bg-rose-100 transition-colors flex items-start gap-4">
                                            <div className="p-3 bg-rose-500 rounded-lg text-white">
                                                <Home className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-rose-900 group-hover:underline">{AFFILIATE_LINKS.airbnb.name}</h4>
                                                <p className="text-sm text-rose-700 mb-2">{AFFILIATE_LINKS.airbnb.description}</p>
                                                <span className="text-xs font-bold text-rose-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                                                    {AFFILIATE_LINKS.airbnb.cta} <ArrowRight className="h-3 w-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                </>
                            )}

                            <div className="h-px bg-slate-200 my-6" />

                            <h3 className="text-lg font-bold text-slate-900 mb-4">Doprava na místě</h3>

                            {/* Rentalcars */}
                            <a href={getRentalcarsUrl()} target="_blank" rel="noopener noreferrer" className="block group">
                                <div className="p-4 rounded-xl bg-green-50 border border-green-100 hover:bg-green-100 transition-colors flex items-start gap-4">
                                    <div className="p-3 bg-green-600 rounded-lg text-white">
                                        <Car className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-green-900 group-hover:underline">{AFFILIATE_LINKS.rentalcars.name}</h4>
                                        <p className="text-sm text-green-700 mb-2">{AFFILIATE_LINKS.rentalcars.description}</p>
                                        <span className="text-xs font-bold text-green-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                                            {AFFILIATE_LINKS.rentalcars.cta} <ArrowRight className="h-3 w-3" />
                                        </span>
                                    </div>
                                </div>
                            </a>

                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}
