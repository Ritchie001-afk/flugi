
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, AlertTriangle, TrendingDown, Globe, ShieldAlert } from "lucide-react";

export const metadata = {
    title: 'Proč jsou překupníci levnější než aerolinky? | Flugi Magazín',
    description: 'Tajemství IT tarifů, měnových kurzů a dumpingu. Kdy se vyplatí koupit letenku od agentury a kdy je to hazard.',
};

export default function ResellerArticle() {
    return (
        <article className="min-h-screen bg-white pt-24 pb-20">
            {/* Header */}
            <header className="container mx-auto px-4 mb-12">
                <Link href="/magazin" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Zpět do magazínu
                </Link>

                <div className="max-w-4xl mx-auto">
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full mb-6 uppercase tracking-wider">
                        Travel Hack & Tipy
                    </span>
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-900 mb-6 leading-tight">
                        Proč je Kiwi.com a další levnější než samotná aerolinka?
                    </h1>
                    <div className="flex items-center gap-6 text-slate-500 text-sm border-b border-slate-100 pb-8 mb-8">
                        <div className="flex items-center gap-2">
                            <span>Autor: Tomáš Flugi</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>5 min čtení</span>
                        </div>
                    </div>
                </div>

                <div className="relative h-[50vh] md:h-[60vh] rounded-3xl overflow-hidden mb-16 shadow-xl">
                    <Image
                        src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=2071&auto=format&fit=crop"
                        alt="Letištní tabule s cenami"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-10 left-10 text-white max-w-xl">
                        <p className="text-lg font-medium opacity-90">
                            Pod vlivem algoritmů. Jak funguje cenotvorba letenek v roce 2026?
                        </p>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto prose prose-lg prose-slate prose-headings:font-display prose-headings:font-bold prose-img:rounded-2xl prose-a:text-blue-600 hover:prose-a:text-blue-700">
                    <p className="lead text-xl text-slate-600 mb-8">
                        Znáte to. Najdete letenku na Skyscanneru, cena je 5 000 Kč přes prodejce (OTA), ale na webu aerolinky ta samá letenka stojí 6 500 Kč. Nedává to smysl? Vždyť překupník musí mít marži! Kde je háček?
                    </p>

                    <div className="mb-12 border-b border-slate-100 pb-12">
                        <h2>1. IT Tarify a Bulk Fares</h2>
                        <p>
                            Velcí prodejci nekupují letenky po jedné jako vy. Mají s aerolinkami nasmlouvané tzv. <strong>IT (Inclusive Tour) tarify</strong> nebo Bulk fare. Ty jsou původně určené pro cestovní kanceláře, které je mají balit do zájezdů (letenka + hotel).
                        </p>
                        <p>
                            Někteří prodejci (zvláště ti agresivní) tato pravidla obcházejí a prodají vám "zájezdovou" letenku samostatně. Tím se dostanou hluboko pod veřejnou cenu aerolinky.
                        </p>
                    </div>

                    <div className="mb-12 border-b border-slate-100 pb-12">
                        <h2>2. Měnová arbitráž</h2>
                        <p>
                            Letenka se prodává v různých zemích za různé ceny. Prodejce může vaši letenku Praha–New York "koupit" virtuálně přes svou pobočku v Egyptě a zaplatit v egyptských librách, které zrovna oslabily. Tuto slevu pak promítne (částečně) vám. Vy zaplatíte v korunách, on aerolince v levné měně.
                        </p>
                        <div className="bg-slate-50 p-6 rounded-xl flex items-start gap-4 not-prose border border-slate-200">
                            <TrendingDown className="h-6 w-6 text-green-600 mt-1" />
                            <div>
                                <h4 className="font-bold text-slate-900 text-base mb-1">Příklad z praxe</h4>
                                <p className="text-slate-600 text-sm">
                                    Let z Brazílie prodávaný v BRL může být o 20 % levnější než ten samý let koupený v EUR, protože aerolinka neaktualizovala kurzovní lístek dostatečně rychle.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-12 border-b border-slate-100 pb-12">
                        <h2>3. Dumping a Market Share</h2>
                        <p>
                            Někdy je to prosté – prodejce na vás prodělá. Chce získat zákazníka, chce se dostat na první místo ve Skyscanneru, a tak dotuje cenu ze svého marketingového rozpočtu. Doufá, že si u něj koupíte pojištění, sedadlo nebo odbavený kufr, kde má marži 100 %.
                        </p>
                    </div>

                    <div className="mb-12 border-b border-slate-100 pb-12">
                        <h2>4. Virtuální propojování (Self-transfer)</h2>
                        <p>
                            Aerolinky spolu často nekamarádí. Ryanair vám neprodá letenku s přípojem na Wizz Air. Překupník to ale udělá – spojí dva nesouvisející lety do jedné rezervace.
                        </p>
                        <p>
                            Vypadá to jako jeden výlet, ale technicky jsou to dvě samostatné cesty. Musíte si v přestupním bodě vyzvednout kufr a znovu ho odbavit. A pokud první letadlo má zpoždění a druhé vám uletí? Aerolinka vám nepomůže. Spoléháte jen na "garanci" prodejce, která je často plná výjimek.
                        </p>
                    </div>

                    <div className="mb-12 border-b border-slate-100 pb-12">
                        <h2>5. Fantomové ceny (Cached prices)</h2>
                        <p>
                            Někdy je nízká cena jen iluze. Vyhledávače si ceny "pamatují" v mezipaměti (cache), aby vám výsledky zobrazily rychle.
                        </p>
                        <p>
                            Když na levnou letenku kliknete, prodejce se teprve v tu chvíli zeptá aerolinky na aktuální stav. A zjistí, že ta levná místa už jsou pryč. Vám pak vyskočí hláška "Cena se změnila" a z 1 500 Kč je náhle 3 000 Kč. Není to vždy podvod, často jen technologické zpoždění dat.
                        </p>
                    </div>

                    <div className="bg-red-50 p-8 rounded-3xl border border-red-100 mb-12 not-prose">
                        <h2 className="text-2xl font-bold text-red-900 mb-4 flex items-center gap-2">
                            <ShieldAlert className="h-6 w-6 text-red-600" />
                            Kdy se vyhnout překupníkům?
                        </h2>
                        <p className="text-red-800/80 mb-6">
                            Nižší cena s sebou nese rizika. Pokud se let zruší, zpozdí nebo potřebujete změnu, aerolinka vás odkáže na prodejce. A ten často:
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-red-900 font-medium">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                                <span>Nemá zákaznickou podporu (nebo jen chatbota)</span>
                            </li>
                            <li className="flex items-center gap-3 text-red-900 font-medium">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                                <span>Účtuje si poplatky za změny (klidně 50 EUR + rozdíl v ceně)</span>
                            </li>
                            <li className="flex items-center gap-3 text-red-900 font-medium">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                                <span>Vrací peníze měsíce místo dnů</span>
                            </li>
                        </ul>
                        <div className="mt-8 pt-6 border-t border-red-200">
                            <p className="font-bold text-red-900">Náš verdikt:</p>
                            <p className="text-red-800 text-sm mt-1">
                                Pokud je rozdíl v ceně malý (do 10 %), kupujte vždy přímo u aerolinky. Ušetříte si nervy. Pokud je rozdíl 50 % (např. Kiwi Hack s přestupem), je to risk, který se může vyplatit – ale musíte vědět, co děláte.
                            </p>
                        </div>
                    </div>

                    <p>
                        Chcete cestovat chytře a bezpečně? Sledujte naše tipy v aplikaci Flugi. Každý den hledáme chyby v systémech, akční tarify a dáváme vám vědět jen o těch, které dávají smysl.
                    </p>

                </div>
            </div>
        </article>
    );
}
