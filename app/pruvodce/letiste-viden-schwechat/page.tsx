
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ArrowRight, MapPin, Car, Train, Clock, Coffee, Info, Plane } from "lucide-react";

export const metadata = {
    title: 'Průvodce Letištěm Vídeň (VIE) | Flugi',
    description: 'Největší letiště v okolí. Jak se tam dostat, kde levně zaparkovat a co čekat.',
};

export default function ViennaAirportGuide() {
    return (
        <article className="min-h-screen bg-white">
            <header className="relative h-[60vh] flex items-end">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1516550893923-42d28e5677af?q=80&w=1472&auto=format&fit=crop"
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
                    <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
                        Letiště Vídeň-Schwechat (VIE)
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-3xl font-light">
                        Hlavní hub pro lety do celého světa. Nejlepší volba pro dálkové lety z Moravy i Čech.
                    </p>
                </div>
            </header>

            <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8 prose prose-lg prose-slate max-w-none">
                    <section>
                        <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                            <Train className="text-blue-600 h-6 w-6" /> Doprava z ČR
                        </h2>
                        <ul className="not-prose space-y-4">
                            <li className="bg-slate-50 p-4 rounded-xl">
                                <strong className="block text-lg">Vlak (Railjet)</strong>
                                <span>Přímé vlaky z Brna a Prahy jezdí na Hlavní nádraží (Hauptbahnhof), odkud jezdí Railjet přímo na letiště každých 30 min.</span>
                            </li>
                            <li className="bg-slate-50 p-4 rounded-xl">
                                <strong className="block text-lg">Autobus (RegioJet/FlixBus)</strong>
                                <span>Přímé spoje z Brna a Prahy přímo před terminál. Často nejrychlejší a nejpohodlnější možnost.</span>
                            </li>
                        </ul>
                    </section>
                    <section>
                        <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 mt-8">
                            <Car className="text-blue-600 h-6 w-6" /> Parkování
                        </h2>
                        <p>
                            Oficiální parking je drahý. Doporučujeme Mazur Parkplatz (cca 10 min busem) nebo Panda Parken.
                        </p>
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
