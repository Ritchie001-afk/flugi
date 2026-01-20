
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, MapPin, Calendar, Clock, Pizza, Landmark, Coins } from "lucide-react";

export const metadata = {
    title: 'Řím: Věčné město za víkend | Flugi Magazín',
    description: 'Jak stihnout Koloseum, Vatikán a nejlepší pizzu za 48 hodin.',
};

export default function RomeArticle() {
    return (
        <article className="min-h-screen bg-white pt-24 pb-20">
            {/* Header */}
            <header className="container mx-auto px-4 mb-12">
                <Link href="/magazin" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Zpět do magazínu
                </Link>

                <div className="max-w-4xl mx-auto">
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full mb-6 uppercase tracking-wider">
                        City Break
                    </span>
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-900 mb-6 leading-tight">
                        Řím: Věčné město za víkend. Jak stihnout to nejlepší?
                    </h1>
                    <div className="flex items-center gap-6 text-slate-500 text-sm border-b border-slate-100 pb-8 mb-8">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>20. ledna 2026</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>8 min čtení</span>
                        </div>
                    </div>
                </div>

                <div className="relative h-[50vh] md:h-[70vh] rounded-3xl overflow-hidden mb-16 shadow-xl">
                    <Image
                        src="/images/magazin/rim/colosseum.png"
                        alt="Koloseum v Římě při západu slunce"
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
                        Všechny cesty vedou do Říma. A pokud máte jen 48 hodin, musíte si vybrat ty správné. Připravili jsme pro vás intenzivní itinerář, díky kterému uvidíte antické památky, ochutnáte nejlepší carbonaru a hodíte minci do fontány di Trevi.
                    </p>

                    <div className="mb-12 border-b border-slate-100 pb-12">
                        <h2>Den 1: Antika a Baroko</h2>
                        <p>
                            Ráno začněte brzy. Opravdu brzy. Pokud chcete fotku u <strong>Fontány di Trevi</strong> bez davů, buďte tam v 7:00. Stojí to za to. Ranní světlo a prázdné náměstí mají neopakovatelnou atmosféru.
                        </p>
                        <Image
                            src="/images/magazin/rim/trevi.png"
                            alt="Fontána di Trevi"
                            width={800}
                            height={500}
                            className="w-full h-auto my-8 rounded-2xl shadow-md"
                        />
                        <p>
                            Odtud pokračujte k <strong>Panteonu</strong>. Je to jedna z nejlépe zachovalých antických staveb na světě. Vstup je nově zpoplatněn (5 EUR), ale fronty postupují rychle.
                        </p>

                        <h3>Koloseum a Forum Romanum</h3>
                        <p>
                            Po obědě (o tom později) zamiřte ke Koloseu. <strong>Tip:</strong> Kupte si lístky online alespoň 2 týdny předem. Na místě jsou fronty na hodiny. Forum Romanum je hned vedle a lístek platí pro obě památky. Projděte se po cestách, kde kráčeli císaři a senátoři.
                        </p>
                    </div>

                    <div className="mb-12 border-b border-slate-100 pb-12">
                        <h2>Gastronomická zastávka: Kde na jídlo?</h2>
                        <p>
                            Řím není o dietách. Je o <em>Cacio e Pepe</em>, <em>Carbonara</em> a <em>Amatriciana</em>. Vyhněte se restauracím s "turistickým menu" a naháněči před vchodem.
                        </p>
                        <Image
                            src="/images/magazin/rim/pasta.png"
                            alt="Pravá římská Carbonara"
                            width={800}
                            height={500}
                            className="w-full h-auto my-8 rounded-2xl shadow-md"
                        />
                        <ul className="not-prose grid gap-4 mt-6">
                            <li className="bg-orange-50 p-4 rounded-xl flex gap-3 items-start">
                                <Pizza className="h-6 w-6 text-orange-600 shrink-0 mt-1" />
                                <div>
                                    <strong className="block text-slate-900">Trastevere</strong>
                                    <span className="text-slate-600 text-sm">Čtvrť za řekou s nejlepší atmosférou a autentickými hospůdkami (trattoria). Zkuste <em>Tonnarello</em> nebo <em>Da Enzo al 29</em>.</span>
                                </div>
                            </li>
                            <li className="bg-yellow-50 p-4 rounded-xl flex gap-3 items-start">
                                <Coins className="h-6 w-6 text-yellow-600 shrink-0 mt-1" />
                                <div>
                                    <strong className="block text-slate-900">Spropitné (Coperto)</strong>
                                    <span className="text-slate-600 text-sm">V Itálii se platí tzv. "coperto" (cca 2-3 EUR na osobu) za prostření. Je to normální a je to na účtence. Spropitné navíc není povinné.</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="mb-12 border-b border-slate-100 pb-12">
                        <h2>Den 2: Vatikán a Andělský hrad</h2>
                        <p>
                            Neděle ve Vatikánu může být přeplněná, ale Svatopetrské náměstí je ohromující kdykoliv. Pokud chcete do Vatikánských muzeí (Sixtinská kaple), opět platí: <strong>rezervace předem je nutnost</strong>.
                        </p>
                        <p>
                            Zakončete výlet procházkou kolem Andělského hradu (Castel Sant'Angelo) při západu slunce. Most přes Tiberu s výhledem na baziliku sv. Petra je jedním z nejfotogeničtějších míst ve městě.
                        </p>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 my-8 not-prose">
                        <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                            <MapPin className="h-5 w-5" /> Jak se dostat z letiště?
                        </h4>
                        <p className="text-blue-800 text-sm mb-4">
                            Z letiště Fiumicino (FCO) jezdí vlak <strong>Leonardo Express</strong> přímo na hlavní nádraží Termini (32 minut, 14 EUR). Levnější variantou jsou autobusy Terravision (cca 6-8 EUR), které ale mohou uvíznout v zácpě.
                        </p>
                        <Link href="/pruvodce">
                            <Button variant="outline" className="bg-white border-blue-200 hover:bg-blue-100 text-blue-700">
                                Více tipů v našich průvodcích
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}
