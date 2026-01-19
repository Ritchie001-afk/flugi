
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ArrowRight, MapPin, Car, Train, Clock, Coffee, Info, Plane, Bus } from "lucide-react";

export const metadata = {
    title: 'Průvodce Letištěm Bratislava (BTS) | Flugi',
    description: 'Letiště M. R. Štefánika. Tipy na levné parkování a jak se dostat autobusem na nádraží.',
};

export default function BratislavaAirportGuide() {
    return (
        <article className="min-h-screen bg-white">
            <header className="relative h-[60vh] flex items-end">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/airports/bratislava.jpg"
                        alt="Letiště Bratislava Štefánik"
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
                        <span className="px-3 py-1 bg-blue-500 rounded-full text-xs font-bold uppercase tracking-wider">Letiště</span>
                        <span className="text-white/80 text-sm">Letisko M. R. Štefánika</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
                        Letiště Bratislava (BTS)
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-3xl font-light">
                        Nejbližší "přímořské" letiště pro jižní Moravu. Oblíbené pro lety Smartwings a Ryanair.
                    </p>
                </div>
            </header>

            <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8 prose prose-lg prose-slate max-w-none">
                    <section>
                        <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                            <Info className="text-blue-600 h-6 w-6" /> Terminál
                        </h2>
                        <p>
                            Letiště má jeden hlavní terminál s příletovou a odletovou halou (rozdělenou na Schengen a Non-Schengen). Budova je moderní a kompaktní, z parkoviště jste u check-inu za 3 minuty.
                        </p>
                    </section>

                    <section>
                        <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 mt-8">
                            <Bus className="text-blue-600 h-6 w-6" /> Autobus 61 na nádraží
                        </h2>
                        <p>
                            Hlavní spojení s centrem zajišťuje linka MHD.
                        </p>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex gap-4 items-start not-prose">
                            <div className="bg-red-600 text-white font-bold px-3 py-1 rounded text-lg">61</div>
                            <div>
                                <h4 className="font-bold text-slate-900 mb-1">Letiště ↔ Hlavná stanica</h4>
                                <p className="text-sm text-slate-600 mb-2">Jede přímo na hlavní vlakové nádraží. Cesta trvá cca 25 minut. Jízdenku si kupte v automatu na zastávce (zvolte 60minutovou pro zóny 100+101).</p>
                                <div className="text-xs text-slate-500 font-mono">Cena: cca 1,20 EUR</div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 mt-8">
                            <Car className="text-blue-600 h-6 w-6" /> Parkování
                        </h2>
                        <p>
                            Oficiální parkování je přímo před terminálem.
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-blue-500">
                            <li><strong>P1 (Krátkodobé):</strong> Pro vyložení/naložení (15 min zdarma).</li>
                            <li><strong>P2 (Dlouhodobé venkovní):</strong> Hlavní parkoviště pro dovolenkáře. Cena za týden se pohybuje okolo 60-70 EUR (při online rezervaci může být méně).</li>
                            <li><strong>Soukromá parkoviště:</strong> V okolí (Parkovanie pri letisku, Monti) pořídíte týden i pod 50 EUR, často s odvozem dodávkou.</li>
                        </ul>
                    </section>
                </div>

                <div className="space-y-8">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 sticky top-24">
                        <h3 className="font-bold text-lg mb-4 text-slate-900">Rychlý přehled</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Kód IATA</span>
                                <span className="font-mono font-bold text-slate-900 bg-white px-2 py-1 rounded border">BTS</span>
                            </li>
                            <li className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Vzdálenost z Brna</span>
                                <span className="font-bold text-slate-900">130 km</span>
                            </li>
                            <li className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">MHD do centra</span>
                                <span className="font-bold text-slate-900">Bus 61</span>
                            </li>
                        </ul>
                        <div className="h-px bg-slate-200 my-6"></div>
                        <a href="https://www.bts.aero" target="_blank" rel="noopener noreferrer">
                            <Button className="w-full" variant="outline">
                                Web letiska <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </article>
    );
}
