
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, MapPin, Calendar, Clock, Fish, Sun, Wallet } from "lucide-react";

export const metadata = {
    title: 'Maledivy bez cestovky: Ráj dostupný pro každého | Flugi Magazín',
    description: 'Jak ušetřit desítky tisíc korun a zažít Maledivy na vlastní pěst. Lokální ostrovy vs. resorty.',
};

export default function MaldivesArticle() {
    return (
        <article className="min-h-screen bg-white pt-24 pb-20">
            {/* Header */}
            <header className="container mx-auto px-4 mb-12">
                <Link href="/magazin" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Zpět do magazínu
                </Link>

                <div className="max-w-4xl mx-auto">
                    <span className="inline-block px-3 py-1 bg-cyan-100 text-cyan-700 text-xs font-bold rounded-full mb-6 uppercase tracking-wider">
                        Exotika & Budget
                    </span>
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-900 mb-6 leading-tight">
                        Maledivy bez cestovky: Ráj na zemi, který vás nezruinuje
                    </h1>
                    <div className="flex items-center gap-6 text-slate-500 text-sm border-b border-slate-100 pb-8 mb-8">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>18. ledna 2026</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>12 min čtení</span>
                        </div>
                    </div>
                </div>

                <div className="relative h-[50vh] md:h-[70vh] rounded-3xl overflow-hidden mb-16 shadow-xl">
                    <Image
                        src="/images/magazin/maledivy/bungalow.png"
                        alt="Vodní vily na Maledivách"
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
                        Maledivy byly dlouho synonymem pro nedostupný luxus. Noc za 20 000 Kč a soukromý butler. Ale to se změnilo. Otevření lokálních ostrovů turistům zpřístupnilo tento ráj i běžným smrtelníkům. Ukážeme vám, jak na to.
                    </p>

                    <div className="mb-12 border-b border-slate-100 pb-12">
                        <h2>Lokální ostrovy vs. Resorty</h2>
                        <p>
                            Zásadní rozhodnutí. <strong>Resort</strong> je soukromý ostrov, kde je vše perfektní, alkohol teče proudem a ceny jsou astronomické. <strong>Lokální ostrov</strong> je místo, kde žijí místní.
                        </p>
                        <Image
                            src="/images/magazin/maledivy/beach.png"
                            alt="Pláž na lokálním ostrově"
                            width={800}
                            height={500}
                            className="w-full h-auto my-8 rounded-2xl shadow-md"
                        />
                        <ul className="not-prose grid gap-4 mt-6">
                            <li className="bg-cyan-50 p-4 rounded-xl flex gap-3 items-start">
                                <Wallet className="h-6 w-6 text-cyan-600 shrink-0 mt-1" />
                                <div>
                                    <strong className="block text-slate-900">Rozdíl v ceně</strong>
                                    <span className="text-slate-600 text-sm">Resort: od 10 000 Kč/noc. Lokální ostrov (např. Maafushi, Thoddoo): od 1 200 Kč/noc za krásný guesthouse se snídaní.</span>
                                </div>
                            </li>
                            <li className="bg-yellow-50 p-4 rounded-xl flex gap-3 items-start">
                                <Sun className="h-6 w-6 text-yellow-600 shrink-0 mt-1" />
                                <div>
                                    <strong className="block text-slate-900">Bikini pláže</strong>
                                    <span className="text-slate-600 text-sm">Na lokálních ostrovech platí pravidla islámu. Koupat se v plavkách můžete jen na vyhrazených "Bikini Beaches". Jsou ale nádherné a udržované.</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="mb-12 border-b border-slate-100 pb-12">
                        <h2>Podmořský svět za hubičku</h2>
                        <p>
                            To nejlepší na Maledivách je pod hladinou. A rybám je jedno, jestli bydlíte v resortu nebo v penzionu.
                        </p>
                        <Image
                            src="/images/magazin/maledivy/underwater.png"
                            alt="Šnorchlování s želvami"
                            width={800}
                            height={500}
                            className="w-full h-auto my-8 rounded-2xl shadow-md"
                        />
                        <p>
                            Výlety za žraloky vouskatými (Nurse Sharks) nebo mantami stojí na lokálních ostrovech zlomek ceny resortů. Půldenní výlet se šnorchlováním, obědem a fotkami vyjde na cca 30-50 USD.
                        </p>
                    </div>

                    <div className="mb-12 border-b border-slate-100 pb-12">
                        <h2>Doprava: Speedboat vs. Seaplane</h2>
                        <p>
                            Z letiště v Male se na lokální ostrovy dostanete <strong>veřejným speedboatem</strong>. Jízdní řády jsou pevné, cena cca 25-50 USD podle vzdálenosti. Hydroplány (Seaplane) létají jen do resortů a stojí stovky dolarů.
                        </p>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 my-8 not-prose">
                        <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                            <Fish className="h-5 w-5" /> Tip na letenky
                        </h4>
                        <p className="text-blue-800 text-sm">
                            V poslední době nabízí skvělé akce Wizz Air z Vídně nebo Budapešti (s přestupem v Abu Dhabi). S batohem se dá zpáteční letenka sehnat i pod 8 000 Kč!
                        </p>
                    </div>

                </div>
            </div>
        </article>
    );
}
