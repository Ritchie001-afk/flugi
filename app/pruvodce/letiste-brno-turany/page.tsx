
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ArrowRight, MapPin, Car, Train, Clock, Coffee, Info, Plane } from "lucide-react";
import { getDestinationImage } from "@/lib/images";

export const metadata = {
    title: 'Průvodce Letištěm Brno-Tuřany (BRQ) | Flugi',
    description: 'Vše o brněnském letišti: doprava z centra, parkování, odbavení a služby pro cestovatele.',
};

export default function BrnoAirportGuide() {
    return (
        <article className="min-h-screen bg-white">
            {/* Hero Header */}
            <header className="relative h-[60vh] flex items-end">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/airports/brno.jpg"
                        alt="Letiště Brno Tuřany"
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
                        Letiště Brno-Tuřany (BRQ)
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-3xl font-light">
                        Kompaktní letiště s rychlým odbavením. Ideální start pro dovolené z Moravy.
                    </p>
                </div>
            </header>

            {/* Content */}
            <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Main Article */}
                <div className="lg:col-span-2 space-y-8 prose prose-lg prose-slate max-w-none">
                    <section>
                        <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                            <Info className="text-blue-600 h-6 w-6" /> Odbavení a Terminál
                        </h2>
                        <p>
                            Letiště Brno je malé a velmi přehledné. Disponuje jedním moderním terminálem (tzv. "Odletová hala" s charakteristickou architekturou).
                            Díky velikosti stačí být na letišti cca <strong>90 minut</strong> před odletem, u letů mimo Schengen doporučujeme 2 hodiny.
                        </p>
                    </section>

                    <section>
                        <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 mt-8">
                            <Train className="text-blue-600 h-6 w-6" /> Doprava z centra
                        </h2>
                        <div className="space-y-4 not-prose">
                            <div className="flex gap-4 items-start">
                                <div className="bg-blue-100 p-2 rounded-full mt-1">
                                    <span className="font-bold text-blue-700">E76</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Autobus E76</h4>
                                    <p className="text-slate-600">Jezdí přímo z <strong>Hlavního nádraží</strong>. Cesta trvá cca 20 minut. Přes den jezdí v intervalu 30 minut.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="bg-purple-100 p-2 rounded-full mt-1">
                                    <span className="font-bold text-purple-700">N89</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Noční linka N89</h4>
                                    <p className="text-slate-600">Zajišťuje spojení v nočních hodinách (23:00 - 05:00). Jezdí z Hlavního nádraží.</p>
                                </div>
                            </div>
                            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100 text-sm text-yellow-800 flex gap-3">
                                <Info className="h-5 w-5 shrink-0" />
                                Letiště leží v zóně 101. Platí zde běžné jízdenky IDS JMK (25 Kč na 60 min).
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 mt-8">
                            <Car className="text-blue-600 h-6 w-6" /> Parkování
                        </h2>
                        <p>
                            Výhodou Brna je parkování přímo u terminálu.
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-blue-500">
                            <li><strong>Expresní parkoviště (P1):</strong> Přímo před vchodem. Prvních 20 minut zdarma pro vyložení/naložení.</li>
                            <li><strong>Dlouhodobé stání:</strong> Ceny jsou příznivější než v Praze. Týdenní parkování vyjde na cca 1000-1500 Kč, rezervace online není vždy nutná, ale doporučená v sezóně.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 mt-8">
                            <Coffee className="text-blue-600 h-6 w-6" /> Služby
                        </h2>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-blue-500">
                            <li><strong>Občerstvení:</strong> V hale najdete kavárnu Air Café a menší bistro. Nabídka je základní, doporučujeme najíst se předem.</li>
                            <li><strong>Obchody:</strong> Malý Duty Free shop za bezpečnostní kontrolou.</li>
                            <li><strong>Wifi:</strong> Zdarma po celém terminálu.</li>
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
                                <span className="font-mono font-bold text-slate-900 bg-white px-2 py-1 rounded border">BRQ</span>
                            </li>
                            <li className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Časové pásmo</span>
                                <span className="font-bold text-slate-900">CET (UTC+1)</span>
                            </li>
                            <li className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Vzdálenost z centra</span>
                                <span className="font-bold text-slate-900">7.5 km</span>
                            </li>
                            <li className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Web</span>
                                <a href="https://www.brno-airport.cz" target="_blank" className="font-bold text-blue-600 hover:underline">brno-airport.cz</a>
                            </li>
                        </ul>

                        <div className="h-px bg-slate-200 my-6"></div>

                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <div className="flex items-center gap-2 mb-2 font-bold text-blue-900">
                                <Plane className="h-4 w-4" /> Oblíbené lety z Brna
                            </div>
                            <p className="text-sm text-blue-800/80">
                                Londýn (Stansted), Milán (Bergamo), a sezónní lety do Řecka, Turecka a Egypta.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </article>
    );
}
