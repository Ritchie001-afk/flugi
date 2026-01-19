
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ArrowRight, MapPin, Car, Train, Clock, Coffee, Info, Plane } from "lucide-react";

export const metadata = {
    title: 'Průvodce Letištěm Katovice (KTW) | Flugi',
    description: 'Nejlepší volba pro charterové lety a nízkonákladovky Wizz Air.',
};

export default function KatowiceAirportGuide() {
    return (
        <article className="min-h-screen bg-white">
            <header className="relative h-[60vh] flex items-end">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1542296332-2e44a991849a?q=80&w=1470&auto=format&fit=crop"
                        alt="Letiště Katovice"
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
                        Letiště Katovice (KTW)
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-3xl font-light">
                        Ráj pro nízkonákladové cestování a chartery. Hlavní základna Wizz Air.
                    </p>
                </div>
            </header>

            <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8 prose prose-lg prose-slate max-w-none">
                    <section>
                        <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                            <Car className="text-blue-600 h-6 w-6" /> Doprava
                        </h2>
                        <p>Z Ostravy cca 1 hodina po dálnici A1. Parkování P2 je velmi levné.</p>
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
