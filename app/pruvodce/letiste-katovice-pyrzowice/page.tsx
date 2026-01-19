
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ArrowRight, MapPin, Car, Train, Clock, Coffee, Info, Plane, Bus } from "lucide-react";

export const metadata = {
    title: 'Průvodce Letištěm Katovice (KTW) | Flugi',
    description: 'Nejlepší letiště pro nízkonákladové a charterové lety. Vše o terminálech A, B, C a parkování.',
};

export default function KatowiceAirportGuide() {
    return (
        <article className="min-h-screen bg-white">
            <header className="relative h-[60vh] flex items-end">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/airports/katowice.jpg"
                        alt="Letiště Katovice Pyrzowice"
                        fill
                        className="object-cover brightness-50"
                        priority
                    />
                </div>
                <div className="container mx-auto px-4 relative z-10 pb-12 text-white">
                    <Link href="/pruvodce" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Zpět na průvodce
                    </Link>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-pink-600 rounded-full text-xs font-bold uppercase tracking-wider">Wizz Air Base</span>
                        <span className="text-white/80 text-sm">Katowice Airport</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
                        Letiště Katovice (KTW)
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-3xl font-light">
                        Polská základna pro chartery a Wizz Air. Pozor na rozdělení terminálů!
                    </p>
                </div>
            </header>

            <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8 prose prose-lg prose-slate max-w-none">
                    <section>
                        <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                            <Info className="text-blue-600 h-6 w-6" /> Terminály A, B a C - Pozor na zmatek!
                        </h2>
                        <p>
                            Katovice mají specifický systém terminálů. Nejsou propojené v jeden velký komplex, jak jste zvyklí, ale jsou to samostatné haly vedle sebe.
                        </p>
                        <ul className="grid md:grid-cols-3 gap-4 not-prose mt-4">
                            <li className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <span className="text-2xl font-bold text-blue-900 block mb-2">Terminál A</span>
                                <span className="font-bold text-slate-700 block mb-1">Odlety Non-Schengen</span>
                                <p className="text-xs text-slate-500">Velká Británie, Turecko, Egypt, Tunis.</p>
                            </li>
                            <li className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <span className="text-2xl font-bold text-blue-900 block mb-2">Terminál B</span>
                                <span className="font-bold text-slate-700 block mb-1">Odlety Schengen</span>
                                <p className="text-xs text-slate-500">Španělsko, Itálie, Řecko, Norsko.</p>
                            </li>
                            <li className="bg-green-50 p-4 rounded-xl border border-green-100">
                                <span className="text-2xl font-bold text-green-900 block mb-2">Terminál C</span>
                                <span className="font-bold text-slate-700 block mb-1">Všechny Přílety</span>
                                <p className="text-xs text-slate-500">Zde vždy přistanete a vyzvednete si kufry. Je to nová budova.</p>
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 mt-8">
                            <Car className="text-blue-600 h-6 w-6" /> Doprava a Parkování
                        </h2>
                        <p>Z Ostravy jste tu za hodinu (115 km) po dálnici A1. Sjezd je výborně značený ("Pyrzowice").</p>

                        <h4 className="font-bold mt-4 text-slate-900">Parkování (Levné!)</h4>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-blue-500">
                            <li><strong>P1 (Přímo u terminálů):</strong> Nejdražší, nekryté. Vhodné pro krátkodobé stání nebo odlety na poslední chvíli. (Cca 300 PLN / týden).</li>
                            <li><strong>P2 (Ekonomické):</strong> Obrovská plocha cca 300m od terminálů. Nejlepší poměr cena/výkon pro Čechy. Často okolo 150 PLN / týden.</li>
                            <li><strong>Transfer z P2 zdarma:</strong> I z P2 vás k terminálu často doveze mikrobus, pokud se vám nechce jít pěšky.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 mt-8">
                            <Coffee className="text-blue-600 h-6 w-6" /> Služby
                        </h2>
                        <p>
                            Letiště je funkční, ale nečekejte luxus. Na terminálu A i B jsou kavárny (So! Coffee) a Duty Free shopy. Ceny jsou nižší než v Praze nebo Vídni.
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-blue-500">
                            <li><strong>Fast Track:</strong> K dispozici v obou odletových terminálech.</li>
                            <li><strong>Business Lounge:</strong> Klidnější zóna pro práci, vstup lze zakoupit na místě.</li>
                        </ul>
                    </section>
                </div>

                <div className="space-y-8">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 sticky top-24">
                        <h3 className="font-bold text-lg mb-4 text-slate-900">Rychlý přehled</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Kód IATA</span>
                                <span className="font-mono font-bold text-slate-900 bg-white px-2 py-1 rounded border">KTW</span>
                            </li>
                            <li className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Vzdálenost z Ostravy</span>
                                <span className="font-bold text-slate-900">115 km</span>
                            </li>
                            <li className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Hlavní dopravce</span>
                                <span className="font-bold text-pink-600">Wizz Air</span>
                            </li>
                        </ul>
                        <div className="h-px bg-slate-200 my-6"></div>
                        <a href="https://www.katowice-airport.com" target="_blank" rel="noopener noreferrer">
                            <Button className="w-full" variant="outline">
                                Web letiště <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </article>
    );
}
