import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image"; // Added import
import { ArrowRight, BookOpen } from "lucide-react";

export default function GuidePage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 pt-24 pb-24">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
                            Cestovní průvodce
                        </h1>
                        <p className="text-slate-600 max-w-2xl">
                            Expertní tipy, průvodce letišti a cestovatelské triky, jak létat chytřeji.
                        </p>
                    </div>


                </div>

                {/* Featured Guide */}
                <Link href="/pruvodce/skryte-letenky-hidden-city-ticketing" className="block mb-16 relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 aspect-[21/9] flex items-end group cursor-pointer shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                    {/* Image Placeholder - would be better with real image */}
                    <Image
                        src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop"
                        alt="Hidden City Ticketing"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    <div className="relative z-20 p-8 md:p-12 w-full">
                        <span className="inline-block px-3 py-1 bg-blue-600/20 text-blue-300 border border-blue-500/30 text-xs font-bold rounded-full mb-4">
                            Nejnovější článek
                        </span>
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">
                            Jak najít skryté letenky (Hidden City Ticketing)
                        </h2>
                        <p className="text-slate-300 max-w-2xl text-lg mb-6 line-clamp-2">
                            Objevte tajnou strategii, kterou experti používají k ušetření až 70 % na mezinárodních letech.
                        </p>
                        <Button variant="premium" className="rounded-full pointer-events-none">
                            Číst článek
                        </Button>
                    </div>
                </Link>

                {/* Guides Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* PRG */}
                    <Link href="/pruvodce/letiste-vaclava-havla-praha" className="flex flex-col group cursor-pointer">
                        <div className="aspect-[3/2] rounded-2xl bg-slate-200 border border-slate-200 overflow-hidden mb-4 relative hover:shadow-lg transition-all duration-300">
                            <Image
                                src="https://images.unsplash.com/photo-1541849546-216549ae216d?q=80&w=1470&auto=format&fit=crop"
                                alt="Letiště Praha"
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-3 left-3">
                                <span className="px-2 py-1 bg-white/90 backdrop-blur-md rounded-md text-xs font-bold text-slate-900 border border-white/20 shadow-sm">
                                    Letiště
                                </span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                Letiště Václava Havla Praha (PRG)
                            </h3>
                            <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                                Vše, co potřebujete vědět o terminálech, saloncích, levném parkování a nejrychlejší dopravě do centra Prahy.
                            </p>
                            <div className="flex items-center text-blue-600 text-sm font-medium gap-2 group-hover:underline">
                                Číst více <ArrowRight className="h-4 w-4" />
                            </div>
                        </div>
                    </Link>

                    {/* BRQ */}
                    <Link href="/pruvodce/letiste-brno-turany" className="flex flex-col group cursor-pointer">
                        <div className="aspect-[3/2] rounded-2xl bg-slate-200 border border-slate-200 overflow-hidden mb-4 relative hover:shadow-lg transition-all duration-300">
                            <Image
                                src="/images/airports/brno.jpg"
                                alt="Letiště Brno"
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-3 left-3">
                                <span className="px-2 py-1 bg-white/90 backdrop-blur-md rounded-md text-xs font-bold text-slate-900 border border-white/20 shadow-sm">
                                    Letiště
                                </span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                Letiště Brno-Tuřany (BRQ)
                            </h3>
                            <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                                Malé, ale šikovné. Průvodce parkováním, dopravou a službami na letišti v Brně.
                            </p>
                            <div className="flex items-center text-blue-600 text-sm font-medium gap-2 group-hover:underline">
                                Číst více <ArrowRight className="h-4 w-4" />
                            </div>
                        </div>
                    </Link>

                    {/* OSR */}
                    <Link href="/pruvodce/letiste-leose-janacka-ostrava" className="flex flex-col group cursor-pointer">
                        <div className="aspect-[3/2] rounded-2xl bg-slate-200 border border-slate-200 overflow-hidden mb-4 relative hover:shadow-lg transition-all duration-300">
                            <Image
                                src="/images/airports/ostrava.jpg"
                                alt="Letiště Ostrava"
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-3 left-3">
                                <span className="px-2 py-1 bg-white/90 backdrop-blur-md rounded-md text-xs font-bold text-slate-900 border border-white/20 shadow-sm">
                                    Letiště
                                </span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                Letiště Ostrava (OSR)
                            </h3>
                            <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                                Jediné letiště v ČR s vlakovým spojením. Tipy na dopravu a parkování zdarma.
                            </p>
                            <div className="flex items-center text-blue-600 text-sm font-medium gap-2 group-hover:underline">
                                Číst více <ArrowRight className="h-4 w-4" />
                            </div>
                        </div>
                    </Link>

                    {/* VIE */}
                    <Link href="/pruvodce/letiste-viden-schwechat" className="flex flex-col group cursor-pointer">
                        <div className="aspect-[3/2] rounded-2xl bg-slate-200 border border-slate-200 overflow-hidden mb-4 relative hover:shadow-lg transition-all duration-300">
                            <Image
                                src="/images/airports/vienna.jpg"
                                alt="Letiště Vídeň"
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-3 left-3">
                                <span className="px-2 py-1 bg-white/90 backdrop-blur-md rounded-md text-xs font-bold text-slate-900 border border-white/20 shadow-sm">
                                    Letiště
                                </span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                Letiště Vídeň (VIE)
                            </h3>
                            <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                                Největší hub v okolí. Přímé vlaky z Brna, obrovská nabídka dálkových letů.
                            </p>
                            <div className="flex items-center text-blue-600 text-sm font-medium gap-2 group-hover:underline">
                                Číst více <ArrowRight className="h-4 w-4" />
                            </div>
                        </div>
                    </Link>

                    {/* KRK */}
                    <Link href="/pruvodce/letiste-krakov-balice" className="flex flex-col group cursor-pointer">
                        <div className="aspect-[3/2] rounded-2xl bg-slate-200 border border-slate-200 overflow-hidden mb-4 relative hover:shadow-lg transition-all duration-300">
                            <Image
                                src="/images/airports/krakow.jpg"
                                alt="Letiště Krakov"
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-3 left-3">
                                <span className="px-2 py-1 bg-white/90 backdrop-blur-md rounded-md text-xs font-bold text-slate-900 border border-white/20 shadow-sm">
                                    Letiště
                                </span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                Letiště Krakov (KRK)
                            </h3>
                            <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                                Skvělá alternativa pro cestující z Ostravska. Moderní terminál a spousta nízkonákladovek.
                            </p>
                            <div className="flex items-center text-blue-600 text-sm font-medium gap-2 group-hover:underline">
                                Číst více <ArrowRight className="h-4 w-4" />
                            </div>
                        </div>
                    </Link>

                    {/* KTW */}
                    <Link href="/pruvodce/letiste-katovice-pyrzowice" className="flex flex-col group cursor-pointer">
                        <div className="aspect-[3/2] rounded-2xl bg-slate-200 border border-slate-200 overflow-hidden mb-4 relative hover:shadow-lg transition-all duration-300">
                            <Image
                                src="/images/airports/katowice.jpg"
                                alt="Letiště Katovice"
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-3 left-3">
                                <span className="px-2 py-1 bg-white/90 backdrop-blur-md rounded-md text-xs font-bold text-slate-900 border border-white/20 shadow-sm">
                                    Letiště
                                </span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                Letiště Katovice (KTW)
                            </h3>
                            <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                                Ráj pro charterové lety a Wizz Air. Levné parkování a snadná dostupnost po dálnici.
                            </p>
                            <div className="flex items-center text-blue-600 text-sm font-medium gap-2 group-hover:underline">
                                Číst více <ArrowRight className="h-4 w-4" />
                            </div>
                        </div>
                    </Link>

                    {/* BTS */}
                    <Link href="/pruvodce/letiste-bratislava-stefanik" className="flex flex-col group cursor-pointer">
                        <div className="aspect-[3/2] rounded-2xl bg-slate-200 border border-slate-200 overflow-hidden mb-4 relative hover:shadow-lg transition-all duration-300">
                            <Image
                                src="/images/airports/bratislava.jpg"
                                alt="Letiště Bratislava"
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-3 left-3">
                                <span className="px-2 py-1 bg-white/90 backdrop-blur-md rounded-md text-xs font-bold text-slate-900 border border-white/20 shadow-sm">
                                    Letiště
                                </span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                Letiště Bratislava (BTS)
                            </h3>
                            <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                                Menší, klidné letiště ideální pro lety Smartwings k moři. Z Brna co by kamenem dohodil.
                            </p>
                            <div className="flex items-center text-blue-600 text-sm font-medium gap-2 group-hover:underline">
                                Číst více <ArrowRight className="h-4 w-4" />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div >
    );
}
