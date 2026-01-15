
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ArrowRight, MapPin, Car, Train, Clock, Coffee, Info } from "lucide-react";
import { getDestinationImage } from "@/lib/images";

export const metadata = {
    title: 'Průvodce Letištěm Václava Havla Praha (PRG) | Flugi',
    description: 'Vše, co potřebujete vědět o Terminálu 1 a 2, parkování, dopravě do centra a kde se nejlépe najíst.',
};

export default function PragueAirportGuide() {
    return (
        <article className="min-h-screen bg-white">
            {/* Hero Header */}
            <header className="relative h-[60vh] flex items-end">
                <div className="absolute inset-0 z-0">
                    <Image
                        src={getDestinationImage("Prague")} // Fallback to generic Prague image
                        alt="Letiště Václava Havla Praha"
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
                        <span className="text-white/80 text-sm">Aktualizováno 2024</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
                        Letiště Václava Havla Praha (PRG)
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-3xl font-light">
                        Kompletní průvodce pro cestovatele: terminály, levné parkování a jak se dostat do centra bez stresu.
                    </p>
                </div>
            </header>

            {/* Content */}
            <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Main Article */}
                <div className="lg:col-span-2 space-y-8 prose prose-lg prose-slate max-w-none">
                    <section>
                        <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                            <Info className="text-blue-600 h-6 w-6" /> Terminály: Kde se odbavit?
                        </h2>
                        <p>
                            Letiště Praha má dva hlavní terminály pro cestující. Je důležité vědět, ze kterého letíte, abyste ušetřili čas.
                        </p>
                        <ul className="grid md:grid-cols-2 gap-4 not-prose mt-4">
                            <li className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <span className="text-3xl font-bold text-blue-900 block mb-2">Terminál 1</span>
                                <span className="font-bold text-slate-700 block mb-1">Mimo Schengenský prostor</span>
                                <p className="text-sm text-slate-500">Lety do USA, Velké Británie, Afriky, Asie a Blízkého východu.</p>
                            </li>
                            <li className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <span className="text-3xl font-bold text-green-900 block mb-2">Terminál 2</span>
                                <span className="font-bold text-slate-700 block mb-1">Schengenský prostor</span>
                                <p className="text-sm text-slate-500">Většina letů po Evropě (EU). Bez pasové kontroly.</p>
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 mt-8">
                            <Train className="text-blue-600 h-6 w-6" /> Doprava do centra
                        </h2>
                        <div className="space-y-4 not-prose">
                            <div className="flex gap-4 items-start">
                                <div className="bg-blue-100 p-2 rounded-full mt-1">
                                    <span className="font-bold text-blue-700">59</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Trolejbus 59 (dříve Bus 119)</h4>
                                    <p className="text-slate-600">Nejrychlejší spojení na metro <strong>A (Nádraží Veleslavín)</strong>. Jezdí každých 3-10 minut. Cesta trvá cca 17 minut.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="bg-red-100 p-2 rounded-full mt-1">
                                    <span className="font-bold text-red-700">100</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Autobus 100</h4>
                                    <p className="text-slate-600">Přímý spoj na metro <strong>B (Zličín)</strong>. Ideální pro cesty na západní okraj Prahy.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="bg-yellow-100 p-2 rounded-full mt-1">
                                    <span className="font-bold text-yellow-700">AE</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Airport Express (AE)</h4>
                                    <p className="text-slate-600">Přímý spoj na <strong>Hlavní nádraží</strong>. Neplatí zde běžné jízdenky MHD, lístek stojí cca 4 EUR / 100 Kč.</p>
                                </div>
                            </div>
                            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100 text-sm text-yellow-800 flex gap-3">
                                <Info className="h-5 w-5 shrink-0" />
                                Nezapomeňte si koupit jízdenku před nástupem v automatech nebo přes aplikaci Lítačka. Jízdenka na 90 minut (40 Kč) obvykle stačí.
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 mt-8">
                            <Car className="text-blue-600 h-6 w-6" /> Parkování
                        </h2>
                        <p>
                            Oficiální parkování přímo na letišti může být drahé, pokud nerezervujete dopředu.
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-blue-500">
                            <li><strong>Aeroparking (Smart):</strong> Nejlevnější oficiální varianta přímo u terminálu 2. Ceny od cca 1000 Kč / týden při včasné online rezervaci.</li>
                            <li><strong>Go Parking:</strong> Velké soukromé parkoviště pár minut od letiště s kyvadlovou dopravou zdarma. Často levnější než oficiální parking.</li>
                            <li><strong>Krátkodobé (Express):</strong> Zdarma na 15 minut pro vysazení cestujících přímo před terminály. Pozor, opakovaný vjezd je zpoplatněn!</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 mt-8">
                            <Coffee className="text-blue-600 h-6 w-6" /> Jídlo a odpočinek
                        </h2>
                        <p>
                            Ceny na letišti jsou vyšší, ale i zde se dá najíst rozumně.
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-blue-500">
                            <li><strong>Restaurace Runway (Landside):</strong> Nejlevnější možnost stravování. Jídelna pro zaměstnance i veřejnost v Terminálu 1 (přílety). Obědové menu za běžné pražské ceny.</li>
                            <li><strong>Billa (Terminál 2):</strong> Supermarket s běžnými cenami. Ideální pro nákup svačiny před letem.</li>
                            <li><strong>Mastercard Lounge (T1):</strong> Vstup zdarma pro držitele prémiových karet (World Elite, Platinum). Ideální klid a občerstvení zdarma.</li>
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
                                <span className="font-mono font-bold text-slate-900 bg-white px-2 py-1 rounded border">PRG</span>
                            </li>
                            <li className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Časové pásmo</span>
                                <span className="font-bold text-slate-900">CET (UTC+1)</span>
                            </li>
                            <li className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Vzdálenost z centra</span>
                                <span className="font-bold text-slate-900">17 km</span>
                            </li>
                            <li className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Wifi</span>
                                <span className="font-bold text-green-600">Zdarma (Neomezeně)</span>
                            </li>
                        </ul>

                        <div className="h-px bg-slate-200 my-6"></div>

                        <a href="https://www.prg.aero/lety" target="_blank" rel="noopener noreferrer">
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
