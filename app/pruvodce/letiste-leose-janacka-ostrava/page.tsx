
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ArrowRight, MapPin, Car, Train, Clock, Coffee, Info, Plane } from "lucide-react";
import { getDestinationImage } from "@/lib/images";

export const metadata = {
    title: 'Průvodce Letištěm Leoše Janáčka Ostrava (OSR) | Flugi',
    description: 'Vlakem až k terminálu? Vše o letišti v Ostravě, parkování a spojení.',
};

export default function OstravaAirportGuide() {
    return (
        <article className="min-h-screen bg-white">
            {/* Hero Header */}
            <header className="relative h-[60vh] flex items-end">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1596825205420-72c207f2df23?q=80&w=2070&auto=format&fit=crop"
                        alt="Letiště Ostrava Mošnov"
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
                        <span className="px-3 py-1 bg-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">Letiště</span>
                        <span className="text-white/80 text-sm">Aktualizováno 2025</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
                        Letiště Leoše Janáčka Ostrava (OSR)
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-3xl font-light">
                        Jediné letiště v Česku, kam dojedete vlakem přímo k terminálu. Brána do světa pro Moravskoslezský kraj.
                    </p>
                </div>
            </header>

            {/* Content */}
            <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Main Article */}
                <div className="lg:col-span-2 space-y-8 prose prose-lg prose-slate max-w-none">
                    <section>
                        <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                            <Info className="text-blue-600 h-6 w-6" /> Odbavení
                        </h2>
                        <p>
                            Letiště v Mošnově je prostorné a moderní. Provoz je zde klidný, fronty bývají minimální.
                            Doporučený čas příjezdu je <strong>90 minut</strong> před odletem. Terminál je otevřen 24 hodin denně.
                        </p>
                    </section>

                    <section>
                        <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 mt-8">
                            <Train className="text-blue-600 h-6 w-6" /> Doprava z centra - Unikátní Vlak!
                        </h2>
                        <p>
                            Obrovskou výhodou Ostravy je přímé železniční spojení.
                        </p>
                        <div className="space-y-4 not-prose">
                            <div className="flex gap-4 items-start">
                                <div className="bg-blue-100 p-2 rounded-full mt-1">
                                    <span className="font-bold text-blue-700">S4</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Vlaková linka S4</h4>
                                    <p className="text-slate-600">Jezdí z <strong>Ostrava-Svinov</strong> a <strong>Ostrava hl.n.</strong> přímo do stanice <em>Mošnov, Ostrava Airport</em>. Terminál je propojen krytou chodbou.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="bg-green-100 p-2 rounded-full mt-1">
                                    <span className="font-bold text-green-700">Bus</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Autobusy</h4>
                                    <p className="text-slate-600">Linka <strong>880, 910</strong> z Ostravy nebo Nového Jičína. Zastávka je přímo před halou.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 mt-8">
                            <Car className="text-blue-600 h-6 w-6" /> Parkování
                        </h2>
                        <p>
                            Parkoviště se nachází přímo před terminálem.
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-blue-500">
                            <li><strong>P1 (Krátkodobé):</strong> Zdarma na 15 minut.</li>
                            <li><strong>P3/P4 (Dlouhodobé):</strong> Pro dovolenkáře. Rezervace není nutná, kapacita je dostatečná. Cena za týden cca 800 - 1200 Kč.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 mt-8">
                            <Coffee className="text-blue-600 h-6 w-6" /> Služby a Lety
                        </h2>
                        <p>
                            Z Ostravy se létá pravidelně linkami:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-blue-500">
                            <li><strong>LOT:</strong> Do Varšavy (a dále do světa).</li>
                            <li><strong>Ryanair:</strong> Do Londýna (Stansted) a Malagy.</li>
                            <li><strong>Smartwings:</strong> Sezónní lety do stovek dovolenkových destinací.</li>
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
                                <span className="font-mono font-bold text-slate-900 bg-white px-2 py-1 rounded border">OSR</span>
                            </li>
                            <li className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Časové pásmo</span>
                                <span className="font-bold text-slate-900">CET (UTC+1)</span>
                            </li>
                            <li className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Vzdálenost z centra</span>
                                <span className="font-bold text-slate-900">20 km</span>
                            </li>
                            <li className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Vlak</span>
                                <span className="font-bold text-green-600">ANO (Přímo k hale)</span>
                            </li>
                        </ul>

                        <div className="h-px bg-slate-200 my-6"></div>

                        <a href="https://www.airport-ostrava.cz" target="_blank" rel="noopener noreferrer">
                            <Button className="w-full" variant="outline">
                                Oficiální web letiště <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </a>
                    </div>
                </div>

            </div>
        </article>
    );
}
