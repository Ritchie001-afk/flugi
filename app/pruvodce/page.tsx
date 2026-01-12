
import { Button } from "@/components/ui/Button";
import Link from "next/link";
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

                    <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                        <Button variant="secondary" size="sm" className="shadow-none">Vše</Button>
                        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-blue-600">Letiště</Button>
                        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-blue-600">Tipy</Button>
                        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-blue-600">Destinace</Button>
                    </div>
                </div>

                {/* Featured Guide */}
                <div className="mb-16 relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 aspect-[21/9] flex items-end group cursor-pointer shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                    {/* Image Placeholder */}
                    <div className="absolute inset-0 bg-slate-800 animate-pulse transition-colors" />

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
                        <Button variant="premium" className="rounded-full">
                            Číst článek
                        </Button>
                    </div>
                </div>

                {/* Guides Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <article key={i} className="flex flex-col group cursor-pointer">
                            <div className="aspect-[3/2] rounded-2xl bg-slate-200 border border-slate-200 overflow-hidden mb-4 relative hover:shadow-lg transition-all duration-300">
                                <div className="absolute inset-0 bg-slate-300 animate-pulse group-hover:animate-none group-hover:bg-slate-400 transition-colors" />
                                <div className="absolute top-3 left-3">
                                    <span className="px-2 py-1 bg-white/90 backdrop-blur-md rounded-md text-xs font-bold text-slate-900 border border-white/20 shadow-sm">
                                        Letiště
                                    </span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    Kompletní průvodce Letištěm Václava Havla (PRG)
                                </h3>
                                <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                                    Vše, co potřebujete vědět o terminálech, saloncích a dopravě do centra města.
                                </p>
                                <div className="flex items-center text-blue-600 text-sm font-medium gap-2 group-hover:underline">
                                    Číst více <ArrowRight className="h-4 w-4" />
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
}
