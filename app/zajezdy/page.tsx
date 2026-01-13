
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import prisma from "@/lib/db";
import Link from "next/link";
import { MapPin, Calendar, ArrowRight, Sun, Umbrella } from "lucide-react";
import { getDestinationImage } from "@/lib/images";

export const revalidate = 3600; // Revalidate every hour

export default async function ToursPage() {
    // Fetch only packages (Invia etc.)
    const deals = await prisma.deal.findMany({
        where: { type: 'package' },
        orderBy: { createdAt: 'desc' },
        take: 50
    });

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-24">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">
                            Zájezdy a dovolená
                        </h1>
                        <p className="text-slate-600">
                            Kompletní balíčky (letenka + hotel) pro tvou dokonalou relaxaci.
                        </p>
                    </div>
                </div>

                {deals.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
                        <div className="inline-flex items-center justify-center p-4 bg-orange-100 rounded-full mb-4">
                            <Umbrella className="h-8 w-8 text-orange-500" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Zatím tu nic není</h2>
                        <p className="text-slate-500 max-w-md mx-auto">
                            Právě jednáme s cestovkami o těch nejlepších nabídkách. Zkuste to prosím později nebo mrkněte na letenky.
                        </p>
                        <Link href="/deals" className="inline-flex items-center gap-2 text-blue-600 font-bold mt-6 hover:underline">
                            Mrknout na levné letenky <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {deals.map((deal) => {
                            const image = getDestinationImage(deal.destination, deal.image);
                            return (
                                <Link
                                    key={deal.id}
                                    href={`/deal/${deal.id}`}
                                    className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <div className="absolute inset-0 bg-slate-200 animate-pulse" />
                                        <img
                                            src={image}
                                            alt={deal.title}
                                            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-orange-600 shadow-sm flex items-center gap-1">
                                            <Sun className="h-3 w-3" /> Zájezd
                                        </div>
                                    </div>
                                    <div className="p-5 flex flex-col flex-grow">
                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <div>
                                                <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                    {deal.title}
                                                </h3>
                                                <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {deal.destination}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <Calendar className="h-4 w-4" />
                                                <span className="text-xs">Invia.cz</span>
                                            </div>
                                            <span className="text-lg font-bold text-blue-600">
                                                {deal.price} {deal.currency}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
