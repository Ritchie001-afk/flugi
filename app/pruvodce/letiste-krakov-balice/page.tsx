
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ArrowRight, MapPin, Car, Train, Clock, Coffee, Info, Plane, Bus } from "lucide-react";

export const metadata = {
    title: 'Průvodce Letištěm Krakov (KRK) | Flugi',
    description: 'Nejlepší polské letiště pro Čechy. Vše o dopravě, parkování a terminálu.',
};

export default function KrakowAirportGuide() {
    return (
        <article className="min-h-screen bg-white">
            <header className="relative h-[60vh] flex items-end">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1596328695027-d0354178a87c?q=80&w=1470&auto=format&fit=crop"
                        alt="Letiště Krakov Balice"
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
                        <span className="px-3 py-1 bg-purple-600 rounded-full text-xs font-bold uppercase tracking-wider">Letiště</span>
                        <span className="text-white/80 text-sm">John Paul II International Airport</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
                        Letiště Krakov (KRK)
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-3xl font-light">
                        Největší regionální letiště v Polsku a skvělá alternativa pro cestující z Ostravska. Moderní terminál, snadná dostupnost a spousta letů.
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
                            Letiště má jeden hlavní, moderní <strong>Terminál pro cestující</strong>, který je propojen s vlakovým nádražím a parkovacím domem krytou lávkou. Orientace je zde velmi intuitivní.
                        </p>
                        <ul className="grid md:grid-cols-2 gap-4 not-prose mt-4">
                            <li className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <span className="font-bold text-slate-900 block mb-2">Přílety a Odlety</span>
                                <p className="text-sm text-slate-600">Vše probíhá v jedné budově. Odbavovací přepážky jsou v levé části haly (při pohledu zvenčí), přílety v pravé.</p>
                            </li>
                            <li className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <span className="font-bold text-slate-900 block mb-2">Gate Area</span>
                                <p className="text-sm text-slate-600">Po bezpečnostní kontrole se gaty dělí na Schengen (vlevo) a Non-Schengen (vpravo, po pasové kontrole).</p>
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 mt-8">
                            <Car className="text-blue-600 h-6 w-6" /> Doprava z ČR (Ostrava)
                        </h2>
                        <p>
                            Z Ostravy je to na letiště Balice pouhých <strong>160 km</strong>, což po dálnici D1 (PL A1) a obchvatu Krakova zabere cca <strong>1 hodinu a 40 minut</strong>.
                        </p>
                        <div className="space-y-4 not-prose mt-4">
                            <div className="flex gap-4 items-start">
                                <div className="bg-green-100 p-2 rounded-full mt-1">
                                    <Bus className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">FlixBus / RegioJet</h4>
                                    <p className="text-slate-600">Přímé autobusy jezdí z Ostravy-Svinova přímo na letiště Krakov. Cena se pohybuje okolo 250-400 Kč jednosměrně.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 mt-8">
                            <Train className="text-blue-600 h-6 w-6" /> Vlakem do centra Krakova
                        </h2>
                        <p>
                            Pokud se chcete podívat do města, nejrychlejší volbou je vlak <strong>SKA1</strong>. Zastávka je přímo u terminálu (krytá). Jízda na <em>Kraków Główny</em> trvá 17 minut a lístek stojí 17 PLN (cca 100 Kč).
                        </p>
                    </section>

                    <section>
                        <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 mt-8">
                            <Car className="text-blue-600 h-6 w-6" /> Parkování
                        </h2>
                        <p>Parkování je zde výrazně dražší než v Katovicích, ale existují levnější varianty.</p>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-blue-500">
                            <li><strong>Kiss & Fly:</strong> Přímo před terminálem. <strong>Zdarma na 10 minut</strong> pro vyložení cestujících.</li>
                            <li><strong>P1 (Kryté garáže):</strong> Přímo naproti terminálu. Nejdražší a nejpohodlnější možnost. (Cca 220 PLN / týden).</li>
                            <li><strong>P2 / P3 (Venkovní):</strong> Oficiální nekryté parkingy, cca 3 minuty chůze. Levnější (Cca 160 PLN / týden).</li>
                            <li><strong>Soukromá parkoviště:</strong> V okolí letiště (např. v obci Balice) je spousta soukromých ploch s odvozem zdarma. Zde seženete týden i pod 100 PLN.</li>
                        </ul>
                    </section>
                </div>

                <div className="space-y-8">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 sticky top-24">
                        <h3 className="font-bold text-lg mb-4 text-slate-900">Rychlý přehled</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Kód IATA</span>
                                <span className="font-mono font-bold text-slate-900 bg-white px-2 py-1 rounded border">KRK</span>
                            </li>
                            <li className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Vzdálenost z Ostravy</span>
                                <span className="font-bold text-slate-900">160 km</span>
                            </li>
                            <li className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Wifi</span>
                                <span className="font-bold text-green-600">Zdarma (KRK Free WiFi)</span>
                            </li>
                            <li className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Hlavní dopravce</span>
                                <span className="font-bold text-slate-900">Ryanair, Wizz Air</span>
                            </li>
                        </ul>
                        <div className="h-px bg-slate-200 my-6"></div>
                        <a href="https://krakowairport.pl" target="_blank" rel="noopener noreferrer">
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
