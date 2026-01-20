
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, MapPin, Calendar, Clock, Mountain, Flower, Footprints, Sun } from "lucide-react";

export const metadata = {
    title: 'Madeira: Ostrov věčného jara | Flugi Magazín',
    description: 'Průvodce po nejkrásnějších levádách, vyhlídkách a zahradách Madeiry.',
};

export default function MadeiraArticle() {
    return (
        <article className="min-h-screen bg-white pt-24 pb-20">
            {/* Header */}
            <header className="container mx-auto px-4 mb-12">
                <Link href="/magazin" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Zpět do magazínu
                </Link>

                <div className="max-w-4xl mx-auto">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full mb-6 uppercase tracking-wider">
                        Příroda & Turistika
                    </span>
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-900 mb-6 leading-tight">
                        Madeira: Ostrov věčného jara, kde si propotíte tričko
                    </h1>
                    <div className="flex items-center gap-6 text-slate-500 text-sm border-b border-slate-100 pb-8 mb-8">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>15. ledna 2026</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>10 min čtení</span>
                        </div>
                    </div>
                </div>

                <div className="relative h-[50vh] md:h-[70vh] rounded-3xl overflow-hidden mb-16 shadow-xl">
                    <Image
                        src="/images/magazin/madeira/mountains.png"
                        alt="Hory na Madeiře při východu slunce"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </header>

            {/* Content */}
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto prose prose-lg prose-slate prose-headings:font-display prose-headings:font-bold prose-img:rounded-2xl prose-a:text-blue-600 hover:prose-a:text-blue-700">
                    <p className="lead text-xl text-slate-600 mb-8">
                        Madeira není jen pro důchodce, jak se občas traduje. Je to divoký atlantický ostrov plný strmých skal, mlžných pralesů a nekonečných výhledů. Pokud máte rádi aktivní dovolenou, budete to tu milovat.
                    </p>

                    <div className="mb-12 border-b border-slate-100 pb-12">
                        <h2>Nejkrásnější hřebenovka: Pico do Arieiro</h2>
                        <p>
                            Pokud máte na Madeiře zvládnout jen jeden výšlap, musí to být přechod z <strong>Pico do Arieiro (1818 m)</strong> na <strong>Pico Ruivo (1862 m)</strong>.
                        </p>
                        <p>
                            Je to náročné, schody dolů a zase nahoru, tunely ve skále, ale ty výhledy nad mraky jsou nepopsatelné.
                            <strong>Tip:</strong> Zajeďte si na východ slunce na Arieiro autem (parkoviště je nahoře).
                        </p>
                    </div>

                    <div className="mb-12 border-b border-slate-100 pb-12">
                        <h2>Fenomén Levády</h2>
                        <p>
                            Madeira je protkaná tisíci kilometry zavlažovacích kanálů – levád. Podél nich vedou turistické stezky téměř bez převýšení, často hluboko v pralese Laurisilva (UNESCO).
                        </p>
                        <Image
                            src="/images/magazin/madeira/levada.png"
                            alt="Procházka podél levády"
                            width={800}
                            height={500}
                            className="w-full h-auto my-8 rounded-2xl shadow-md"
                        />
                        <ul className="not-prose grid gap-4 mt-6">
                            <li className="bg-green-50 p-4 rounded-xl flex gap-3 items-start">
                                <Footprints className="h-6 w-6 text-green-600 shrink-0 mt-1" />
                                <div>
                                    <strong className="block text-slate-900">Levada das 25 Fontes</strong>
                                    <span className="text-slate-600 text-sm">Klasika, kterou musí vidět každý. Na konci vás čeká jezírko s 25 vodopády. Bývá tu plno, vyražte brzy.</span>
                                </div>
                            </li>
                            <li className="bg-green-50 p-4 rounded-xl flex gap-3 items-start">
                                <Footprints className="h-6 w-6 text-green-600 shrink-0 mt-1" />
                                <div>
                                    <strong className="block text-slate-900">Levada do Caldeirão Verde</strong>
                                    <span className="text-slate-600 text-sm">Dobrodružnější trasa s dlouhými tunely (baterka nutná!) a obřím vodopádem na konci.</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="mb-12 border-b border-slate-100 pb-12">
                        <h2>Funchal a květiny</h2>
                        <p>
                            Hlavní město Funchal je krásné a čisté, s bílou dlažbou a spoustou parků. Určitě navštivte tržnici <em>Mercado dos Lavradores</em> a vyjeďte lanovkou na Monte, kde můžete navštívit tropickou zahradu.
                        </p>
                        <Image
                            src="/images/magazin/madeira/funchal.png"
                            alt="Funchal a botanická zahrada"
                            width={800}
                            height={500}
                            className="w-full h-auto my-8 rounded-2xl shadow-md"
                        />
                    </div>

                    <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-100 my-8 not-prose">
                        <h4 className="font-bold text-yellow-900 mb-2 flex items-center gap-2">
                            <Sun className="h-5 w-5" /> Kdy vyrazit?
                        </h4>
                        <p className="text-yellow-800 text-sm">
                            Madeiře se říká ostrov věčného jara právem. Teploty jsou stabilní po celý rok (kolem 20-25 °C). V zimě více prší, ale je vše krásně zelené. V létě je stabilnější počasí na hory.
                        </p>
                    </div>

                </div>
            </div>
        </article>
    );
}
