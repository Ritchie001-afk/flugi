import { Button } from "@/components/ui/Button";
import { MapPin, Bus, Train, Car, Coffee, Wifi, Clock, Plane } from "lucide-react";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

export const revalidate = 3600; // Revalidate every hour

export default async function AirportPage({ params }: { params: { iata: string } }) {
    const { iata } = await params;

    const airport = await prisma.airport.findUnique({
        where: { iata: iata.toUpperCase() }
    });

    if (!airport) {
        notFound();
    }

    // Parse transport data
    const transportOptions = airport.transport.map(t => JSON.parse(t));

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Hero */}
            <div className="relative h-[50vh] w-full bg-slate-900 overflow-hidden flex items-end">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent z-10" />
                {/* We could use a specific airport image here if we had one in DB, for now generic or from props */}
                <div className="absolute inset-0 bg-slate-800 z-0 opacity-50" />

                <div className="relative z-20 container mx-auto px-4 pb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="px-4 py-2 bg-blue-600 text-white font-bold text-2xl rounded-xl shadow-lg shadow-blue-900/20">
                            {airport.iata}
                        </span>
                        <div className="flex items-center gap-2 text-blue-100">
                            <MapPin className="h-5 w-5 text-blue-400" />
                            {airport.city}, {airport.country}
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">
                        {airport.name}
                    </h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">

                    {/* Guide Content */}
                    <section className="prose prose-lg prose-slate max-w-none bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <ReactMarkdown>{airport.content}</ReactMarkdown>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                            <Bus className="h-6 w-6 text-blue-600" /> Doprava do centra
                        </h2>
                        <div className="grid gap-4">
                            {transportOptions.map((option: any, index: number) => (
                                <div key={index} className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-500/30 hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-slate-900">{option.name}</h3>
                                        <span className="text-blue-600 font-bold">{option.price}</span>
                                    </div>
                                    <p className="text-slate-600 text-sm mb-4">{option.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-slate-500">
                                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {option.duration}</span>
                                        <span className="flex items-center gap-1">
                                            {option.type === 'bus' && <Bus className="h-3 w-3" />}
                                            {option.type === 'train' && <Train className="h-3 w-3" />}
                                            {option.type === 'taxi' && <Car className="h-3 w-3" />}
                                            {' '}{option.type === 'bus' ? 'Autobus' : option.type === 'train' ? 'Vlak' : 'Auto'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                            <Coffee className="h-6 w-6 text-blue-600" /> Služby
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {airport.facilities.map(facility => (
                                <div key={facility} className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-medium shadow-sm text-center text-sm">
                                    {facility}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar Deals */}
                <div>
                    <div className="sticky top-24 p-6 rounded-2xl bg-white border border-slate-200 shadow-lg">
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Levné letenky z {airport.iata}</h3>
                        <div className="space-y-4">
                            {/* Placeholder for deals from this airport - can be implemented later */}
                            <div className="text-sm text-slate-500 text-center py-4">
                                Momentálně žádné akční letenky přímo z {airport.city}.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
                                        <span>Ryanair</span>
                                        <span>12. Listopad</span>
                                    </div >
                                </div >
                            ))}
                        </div >
    <Button variant="premium" className="w-full mt-6">Zobrazit vše</Button>
                    </div >
                </div >
            </div >
        </div >
    );
}
