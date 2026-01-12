
import { Button } from "@/components/ui/Button";
import { MapPin, Bus, Train, Car, Coffee, Wifi, Clock } from "lucide-react";

export default function AirportPage({ params }: { params: { iata: string } }) {
    // Mock data based on params.iata
    const airport = {
        name: "Letiště Václava Havla Praha",
        iata: params.iata.toUpperCase(),
        city: "Praha",
        country: "Česká republika",
        description: "Hlavní mezinárodní letiště v Praze, nacházející se přibližně 12 km západně od centra města. Slouží jako základna pro České aeroliniie a Smartwings.",
        facilities: ["Wi-Fi zdarma", "Salonky", "Duty Free", "Restaurace"],
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Hero */}
            <div className="relative h-[50vh] w-full bg-slate-900 overflow-hidden flex items-end">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent z-10" />
                <div className="absolute inset-0 bg-slate-800 animate-pulse z-0" /> {/* Placeholder Image */}

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
                    <p className="text-lg text-blue-100 max-w-3xl">
                        {airport.description}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                            <Bus className="h-6 w-6 text-blue-600" /> Doprava do centra
                        </h2>
                        <div className="grid gap-4">
                            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-500/30 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-slate-900">Airport Express (AE)</h3>
                                    <span className="text-blue-600 font-bold">100 Kč</span>
                                </div>
                                <p className="text-slate-600 text-sm mb-4">Přímé autobusové spojení na Hlavní nádraží. Jezdí každých 30 minut.</p>
                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 40 min</span>
                                    <span className="flex items-center gap-1"><Bus className="h-3 w-3" /> Autobus</span>
                                </div>
                            </div>
                            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-500/30 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-slate-900">Uber / Bolt</h3>
                                    <span className="text-blue-600 font-bold">~450 Kč</span>
                                </div>
                                <p className="text-slate-600 text-sm mb-4">Pohodlné služby odvozu dostupné přímo u terminálu.</p>
                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 25-30 min</span>
                                    <span className="flex items-center gap-1"><Car className="h-3 w-3" /> Auto</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                            <Coffee className="h-6 w-6 text-blue-600" /> Služby
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {airport.facilities.map(facility => (
                                <div key={facility} className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-medium shadow-sm">
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
                            {[1, 2, 3].map(i => (
                                <div key={i} className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-slate-900">Londýn (STN)</span>
                                        <span className="text-blue-600 font-bold">890 Kč</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-slate-500">
                                        <span>Ryanair</span>
                                        <span>12. Listopad</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="premium" className="w-full mt-6">Zobrazit vše</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
