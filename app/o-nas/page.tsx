
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Globe, ShieldCheck, Plane, Users, Zap } from "lucide-react";

export const metadata = {
    title: 'O nás | Flugi',
    description: 'Jsme tým cestovatelů a technologických nadšenců, kteří mění způsob, jakým lidé objevují svět.',
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white pt-24 pb-20">
            {/* Hero Section */}
            <section className="container mx-auto px-4 mb-20 text-center">
                <div className="max-w-3xl mx-auto">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full mb-6 uppercase tracking-wider">
                        Náš příběh
                    </span>
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-900 mb-6 leading-tight">
                        Cestování by mělo být <span className="text-blue-600">radost</span>, ne starost.
                    </h1>
                    <p className="text-xl text-slate-600 leading-relaxed">
                        Jsme Flugi. Tým nadšenců, kteří se rozhodli využít technologie k tomu, aby našli ty nejlepší letenky a zájezdy dříve, než zmizí.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="bg-slate-50 py-20 px-4 mb-20">
                <div className="container mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
                            <Image
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop"
                                alt="Náš tým"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-3xl font-display font-bold text-slate-900">
                                Naše mise
                            </h2>
                            <p className="text-slate-600 text-lg">
                                Věříme, že každý si zaslouží vidět svět. Často ale ty nejlepší nabídky zapadnou v záplavě reklam a nepřehledných vyhledávačů.
                            </p>
                            <p className="text-slate-600 text-lg">
                                Proto jsme vytvořili Flugi. Spojujeme chytré algoritmy s lidským citem pro dobrodružství. Nebudujeme další obyčejný vyhledávač. Budujeme kurátorský výběr toho nejlepšího, co se dá aktuálně sehnat.
                            </p>
                            <ul className="space-y-4 pt-4">
                                <li className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg text-green-600"><CheckCircle2 className="h-5 w-5" /></div>
                                    <span className="font-medium text-slate-900">Férové ceny bez skrytých poplatků</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Zap className="h-5 w-5" /></div>
                                    <span className="font-medium text-slate-900">Rychlost a aktuálnost nabídek</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><Users className="h-5 w-5" /></div>
                                    <span className="font-medium text-slate-900">Osobní přístup ke každé destinaci</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="container mx-auto px-4 mb-20">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Hodnoty, kterými žijeme</h2>
                    <p className="text-slate-600">Nejsme korporát. Jsme cestovatelé.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-all">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                            <Globe className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Svoboda</h3>
                        <p className="text-slate-600">Cestování má být o svobodě. Pomáháme vám najít cesty tam, kam vás to táhne, za cenu, která vás nezruinuje.</p>
                    </div>
                    <div className="p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-all">
                        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Důvěra</h3>
                        <p className="text-slate-600">Nehrajeme hry s cenami. To, co vidíte, je to, co platíte. Doporučujeme jen to, co bychom koupili sami.</p>
                    </div>
                    <div className="p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-all">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                            <Plane className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Inovace</h3>
                        <p className="text-slate-600">Neustále vylepšujeme naše nástroje, abychom našli ty nejlevnější a nejzajímavější spojení na trhu.</p>
                    </div>
                </div>
            </section>
        </main>
    );
}
