
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ArrowRight, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export const metadata = {
    title: 'Hidden City Ticketing: Jak ušetřit až 70% na letenkách | Flugi',
    description: 'Tajemství, které aerolinky nenávidí. Naučte se létat levněji pomocí strategie skrytého města.',
};

export default function HiddenCityGuide() {
    return (
        <article className="min-h-screen bg-white">
            {/* Hero Header */}
            <header className="relative h-[50vh] flex items-end">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop"
                        alt="Hidden City Ticketing"
                        fill
                        className="object-cover brightness-50"
                        priority
                    />
                </div>
                <div className="container mx-auto px-4 relative z-10 pb-12 text-white">
                    <Link href="/pruvodce" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Zpět na články
                    </Link>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-purple-600 rounded-full text-xs font-bold uppercase tracking-wider">Tipy & Triky</span>
                        <span className="text-white/80 text-sm">5 min čtení</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">
                        Hidden City Ticketing: Jak ušetřit tisíce na letenkách
                    </h1>
                </div>
            </header>

            {/* Content */}
            <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

                <div className="lg:col-span-2 space-y-6 prose prose-lg prose-slate max-w-none">
                    <p className="lead text-xl text-slate-600">
                        Představte si, že chcete letět z Prahy do Londýna. Přímá letenka stojí 5000 Kč. Ale letenka z Prahy do New Yorku s přestupem v Londýně stojí jen 3500 Kč. Co kdybyste si koupili letenku do New Yorku, ale v Londýně prostě vystoupili? Vítejte ve světě <strong>Hidden City Ticketing</strong>.
                    </p>

                    <h3>Jak to funguje?</h3>
                    <p>
                        Aerolinky naceňují lety podle poptávky, ne podle vzdálenosti. Přímé lety jsou žádanější, a proto často dražší než lety s přestupem. "Skryté město" je strategie, kdy si koupíte letenku s přestupem v místě, kam se skutečně chcete dostat, a poslední úsek cesty vynecháte.
                    </p>

                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 my-8 not-prose rounded-r-xl">
                        <h4 className="flex items-center gap-2 text-yellow-800 font-bold text-lg mb-2">
                            <AlertTriangle className="h-5 w-5" /> Je to legální?
                        </h4>
                        <p className="text-yellow-700">
                            Ano, je to legální – žádný zákon to nezakazuje. Porušujete však přepravní podmínky aerolinky. Pokud to budete dělat příliš často, mohou vám zrušit věrnostní účet nebo vás dát na blacklist.
                        </p>
                    </div>

                    <h3>Zlatá pravidla Skiplaggingu</h3>
                    <p>Aby vám tento trik prošel, musíte dodržovat tato striktní pravidla:</p>

                    <ul className="not-prose space-y-4">
                        <li className="flex items-start gap-3">
                            <XCircle className="h-6 w-6 text-red-500 shrink-0 mt-1" />
                            <div>
                                <strong className="block text-slate-900">Nikdy neodbavujte zavazadlo</strong>
                                <span className="text-slate-600">Vaše zavazadlo by letělo až do cílové destinace (New York). Vy ale vystupujete v Londýně. Cestujte jen s příručním zavazadlem!</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <XCircle className="h-6 w-6 text-red-500 shrink-0 mt-1" />
                            <div>
                                <strong className="block text-slate-900">Nezadávejte věrnostní číslo</strong>
                                <span className="text-slate-600">Aerolinky snadno odhalí, kdo to dělá, pokud sbíráte míle. Pro tyto lety buďte anonymní.</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle className="h-6 w-6 text-green-500 shrink-0 mt-1" />
                            <div>
                                <strong className="block text-slate-900">Funguje to jen jednosměrně</strong>
                                <span className="text-slate-600">Jakmile nenastoupíte na jeden úsek letu (ten poslední), aerolinka automaticky zruší zbytek letenky. Kupujte vždy jen jednosměrné letenky.</span>
                            </div>
                        </li>
                    </ul>

                    <h3>Kde hledat tyto letenky?</h3>
                    <p>
                        Běžné vyhledávače jako Google Flights nebo Skyscanner tyto kombinace neukazují, protože aerolinky je nutí je skrývat. Specializované weby jako <strong>Skiplagged</strong> se na ně ale zaměřují.
                    </p>
                    <p>
                        Pamatujte, je to hra kočky s myší. Ušetřit můžete tisíce, ale vyžaduje to trochu odvahy a cestování na lehko.
                    </p>
                </div>

                {/* Info Box */}
                <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 sticky top-24">
                        <h4 className="font-bold text-slate-900 mb-4">Shrnutí rizik</h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between p-2 bg-white rounded border border-slate-200">
                                <span>Úspora</span>
                                <span className="font-bold text-green-600">Vysoká (až 70%)</span>
                            </div>
                            <div className="flex justify-between p-2 bg-white rounded border border-slate-200">
                                <span>Riziko</span>
                                <span className="font-bold text-orange-500">Střední</span>
                            </div>
                            <div className="flex justify-between p-2 bg-white rounded border border-slate-200">
                                <span>Zavazadla</span>
                                <span className="font-bold text-red-600">Pouze příruční</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </article>
    );
}
