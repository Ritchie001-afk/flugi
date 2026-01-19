
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, MapPin, Calendar, Clock, Share2 } from "lucide-react";

export const metadata = {
    title: '5 nejkrásnějších jezer ve Švýcarsku | Flugi Magazín',
    description: 'Tipy na nejkrásnější jezera ve Švýcarsku, která musíte vidět.',
};

export default function SwissLakesArticle() {
    return (
        <article className="min-h-screen bg-white pt-24 pb-20">
            {/* Header */}
            <header className="container mx-auto px-4 mb-12">
                <Link href="/magazin" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Zpět do magazínu
                </Link>

                <div className="max-w-4xl mx-auto">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full mb-6 uppercase tracking-wider">
                        Destinace
                    </span>
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-900 mb-6 leading-tight">
                        5 nejkrásnějších jezer ve Švýcarsku, která vám vyrazí dech
                    </h1>
                    <div className="flex items-center gap-6 text-slate-500 text-sm border-b border-slate-100 pb-8 mb-8">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>15. ledna 2024</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>5 min čtení</span>
                        </div>
                    </div>
                </div>

                <div className="relative h-[50vh] md:h-[70vh] rounded-3xl overflow-hidden mb-16 shadow-xl">
                    <Image
                        src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop"
                        alt="Švýcarské jezero"
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
                        Švýcarsko není jen o čokoládě, hodinkách a vysokých horách. Je to také země vody. Tyrkysová barva, která vypadá jako z Karibiku, ale s kulisou zasněžených Alp. Vybrali jsme pro vás 5 jezer, která byste neměli minout.
                    </p>

                    <h2>1. Vierwaldstättersee (Lucernské jezero)</h2>
                    <p>
                        Klenot uprostřed Švýcarska. Díky svému nepravidelnému tvaru a strmým břehům připomíná spíše norské fjordy. Nejlepší zážitek? Projížďka historickým kolesovým parníkem z města Lucern.
                    </p>

                    <h2>2. Oeschinensee</h2>
                    <Image
                        src="https://images.unsplash.com/photo-1465311440653-baace58694be?q=80&w=2070&auto=format&fit=crop"
                        alt="Oeschinensee"
                        width={800}
                        height={500}
                        className="w-full h-auto my-8"
                    />
                    <p>
                        Jezero zapsané na seznamu UNESCO. Dostanete se k němu lanovkou z Kanderstegu a pak krátkou procházkou. Voda je v létě dost teplá na rychlé koupání, ale hlavním lákadlem je panorama.
                    </p>

                    <h2>3. Blausee</h2>
                    <p>
                        Malé, ale neuvěřitelně modré. Podle legendy získalo svou barvu ze slz dívky, která zde plakala pro svou lásku. Vstup je placený, ale zahrnuje i projížďku na loďce s proskleným dnem.
                    </p>

                    <h2>4. Brienzersee</h2>
                    <p>
                        Soused známějšího Thunersee, ale s mnohem intenzivnější tyrkysovou barvou. Pokud jste fanoušky seriálu <em>Crash Landing on You</em>, určitě poznáte molo v Iseltwaldu.
                    </p>

                    <h2>5. Caumasee</h2>
                    <p>
                        "Perla Flimsu". Jezero uprostřed lesů s malým ostrůvkem. Voda je zde díky podzemním pramenům překvapivě teplá (až 24°C).
                    </p>

                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 my-8 not-prose">
                        <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                            <MapPin className="h-5 w-5" /> Tip na cestu
                        </h4>
                        <p className="text-blue-800 text-sm">
                            Většina těchto jezer je snadno dostupná vlakem. Švýcarský dopravní systém (SBB) je sice drahý, ale jeden z nejpřesnějších na světě. Zvažte nákup <strong>Swiss Travel Pass</strong> pro neomezené cestování.
                        </p>
                    </div>
                </div>
            </div>
        </article>
    );
}
