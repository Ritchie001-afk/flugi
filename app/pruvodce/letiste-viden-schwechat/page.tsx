
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ArrowRight, MapPin, Car, Train, Clock, Coffee, Info, Plane, Bus } from "lucide-react";

export const metadata = {
    title: 'Průvodce Letištěm Vídeň (VIE) | Flugi',
    description: 'Největší letiště v okolí. Jak ušetřit na parkování a vybrat správný vlak.',
};

export default function ViennaAirportGuide() {
    return (
        <article className="min-h-screen bg-white">
            <header className="relative h-[60vh] flex items-end">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/airports/vienna.jpg"
                        alt="Letiště Vídeň Schwechat"
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
                        <span className="px-3 py-1 bg-red-600 rounded-full text-xs font-bold uppercase tracking-wider">Austrian Hub</span>
                        <span className="text-white/80 text-sm">Vienna International Airport</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
                        Letiště Vídeň-Schwechat (VIE)
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-3xl font-light">
                        Hlavní brána do světa pro Moravu. Obrovská nabídka dálkových letů a perfektní vlakové spojení.
                    </p>
                </div>
            </header>

            <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8 prose prose-lg prose-slate max-w-none">
                    <section className="mb-12 border-b border-slate-100 pb-12">
                        <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                            <Info className="text-blue-600 h-6 w-6" /> Terminály 1 a 3
                        </h2>
                        <p>
                            Vídeň má dva hlavní funkční terminály pro odbavení.
                        </p>
                        <ul className="grid md:grid-cols-2 gap-4 not-prose mt-4">
                            <li className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <span className="font-bold text-slate-900 block mb-2">Terminál 3 (Austrian)</span>
                                <p className="text-sm text-slate-600">Nejnovější terminál. Lety Austrian Airlines, Lufthansa, Swiss a celé Star Alliance (včetně Emirates a Qatar).</p>
                            </li>
                            <li className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <span className="font-bold text-slate-900 block mb-2">Terminál 1</span>
                                <p className="text-sm text-slate-600">Ryanair, Wizz Air a další nízkonákladovky a aerolinky mimo Star Alliance.</p>
                            </li>
                        </ul>
                    </section>

                    <section className="mb-12 border-b border-slate-100 pb-12">
                        <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 mt-0">
                            <Train className="text-blue-600 h-6 w-6" /> Vlakem z Vídně na letiště
                        </h2>
                        <p>
                            Pokud přijedete vlakem nebo autobusem na Vídeň hlavní nádraží (Hauptbahnhof), máte dvě možnosti, jak pokračovat na letiště:
                        </p>
                        <div className="space-y-4 not-prose mt-4">
                            <div className="flex gap-4 items-start">
                                <div className="bg-red-100 p-2 rounded-full mt-1">
                                    <Train className="h-5 w-5 text-red-700" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Railjet (RJ) - Doporučujeme</h4>
                                    <p className="text-slate-600">Přímé, rychlé a pohodlné vlaky z Hlavního nádraží. Jedou každých 30 minut, cesta trvá jen <strong>15 minut</strong>. Mají police na kufry a stojí stejně jako běžná MHD (cca 5,40 EUR, pokud nemáte lístek na Vídeň).</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="bg-blue-100 p-2 rounded-full mt-1">
                                    <span className="font-bold text-blue-700 text-xs">S7</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">S-Bahn S7</h4>
                                    <p className="text-slate-600">Příměstský vlak („zastávkový“), jezdí ze stanice <em>Wien Mitte</em>. Cesta trvá 25 minut. Méně pohodlné pro velké kufry.</p>
                                </div>
                            </div>
                            <div className="p-4 bg-green-50 rounded-xl border border-green-100 text-sm text-green-800 flex gap-3">
                                <Info className="h-5 w-5 shrink-0" />
                                <strong>Tip:</strong> Nekupujte si drahý "CAT" (City Airport Train) za 14 EUR. Časově ušetříte maximálně minutu oproti Railjetu, který stojí třetinu.
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 mt-0">
                            <Car className="text-blue-600 h-6 w-6" /> Parkování
                        </h2>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-blue-500">
                            <li><strong>Parkhaus 3 a 4 (Kryté):</strong> Nejpohodlnější, přímo u terminálu 3 (přejdete suchou nohou). Cena cca 180 EUR / týden (při rezervaci online může být levnější).</li>
                            <li><strong>Mazur Parkplatz (Economy):</strong> Venkovní parkoviště cca 10 minut jízdy busem (shuttle zdarma jezdí non-stop). Výrazně levnější, cca 100 EUR / týden.</li>
                        </ul>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 sticky top-24">
                        <h3 className="font-bold text-lg mb-4 text-slate-900">Rychlý přehled</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Kód IATA</span>
                                <span className="font-mono font-bold text-slate-900 bg-white px-2 py-1 rounded border">VIE</span>
                            </li>
                            <li className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Vzdálenost z Brna</span>
                                <span className="font-bold text-slate-900">145 km</span>
                            </li>
                            <li className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Vlak</span>
                                <span className="font-bold text-green-600">Ano (Přímo pod halou)</span>
                            </li>
                        </ul>
                        <div className="h-px bg-slate-200 my-6"></div>
                        <a href="https://www.viennaairport.com/sk" target="_blank" rel="noopener noreferrer">
                            <Button className="w-full" variant="outline">
                                Web letiště (SK) <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </article>
    );
}
