
import prisma from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Static content registry for search
const STATIC_PAGES = [
    {
        title: "5 nejkrásnějších jezer ve Švýcarsku",
        description: "Švýcarsko není jen o horách. Objevte tyrkysová jezera, která vypadají jako z Karibiku.",
        url: "/magazin/5-nejkrasnejsich-jezer-svycarska",
        type: "Magazín",
        image: "/images/lakes/vierwaldstattersee.png"
    },
    {
        title: "Řím: Věčné město za víkend",
        description: "Jak stihnout Koloseum, Vatikán a sníst co nejvíc pizzy za pouhých 48 hodin.",
        url: "/magazin/rim-vecne-mesto-za-vikend",
        type: "Magazín",
        image: "/images/magazin/rim/colosseum.png"
    },
    {
        title: "Maledivy bez cestovky a levně",
        description: "Zapomeňte na předražené resorty. Ukážeme vám, jak si užít ráj i s normálním rozpočtem.",
        url: "/magazin/maledivy-raj-na-zemi-bez-cestovky",
        type: "Magazín",
        image: "/images/magazin/maledivy/bungalow.png"
    },
    {
        title: "Madeira: Ostrov věčného jara",
        description: "Divoká příroda, levády a hory. Ideální destinace pro aktivní dovolenou po celý rok.",
        url: "/magazin/madeira-ostrov-vecneho-jara",
        type: "Magazín",
        image: "/images/magazin/madeira/mountains.png"
    },
    {
        title: "Letiště Václava Havla Praha (PRG)",
        description: "Průvodce letištěm Praha. Parkování, doprava, terminály a tipy pro cestující.",
        url: "/pruvodce/letiste-vaclava-havla-praha",
        type: "Průvodce",
        image: "https://images.unsplash.com/photo-1569154941061-e0032b8f8a81?auto=format&fit=crop&q=80"
    },
    {
        title: "Letiště Vídeň Schwechat (VIE)",
        description: "Jak se dostat na letiště Vídeň, kde levně zaparkovat a jak na terminály.",
        url: "/pruvodce/letiste-viden-schwechat",
        type: "Průvodce",
        image: "https://images.unsplash.com/photo-1596707323114-5f65a1213768?auto=format&fit=crop&q=80"
    }
    // Add more guides as needed
];

export default async function SearchPage({
    searchParams,
}: {
    searchParams: { q: string };
}) {
    const query = searchParams.q || "";

    // Search Database Deals
    const deals = await prisma.deal.findMany({
        where: {
            OR: [
                { title: { contains: query, mode: "insensitive" } },
                { destination: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
            ],
        },
        take: 10,
    });

    // Search Static Content
    const staticResults = STATIC_PAGES.filter(page =>
        page.title.toLowerCase().includes(query.toLowerCase()) ||
        page.description.toLowerCase().includes(query.toLowerCase())
    );

    const hasResults = deals.length > 0 || staticResults.length > 0;

    return (
        <main className="min-h-screen bg-slate-50 pt-24 pb-20">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-12">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">
                            Výsledky hledání pro: "{query}"
                        </h1>
                        <p className="text-slate-600">
                            Nalezli jsme {deals.length + staticResults.length} výsledků.
                        </p>
                    </header>

                    {!hasResults && (
                        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4 text-slate-400">
                                <Search className="h-8 w-8" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Nic jsme nenašli</h2>
                            <p className="text-slate-500 mb-8">Zkuste zadat jiný výraz nebo se podívejte na naši hlavní nabídku.</p>
                            <Link href="/">
                                <Button>Zpět na úvod</Button>
                            </Link>
                        </div>
                    )}

                    <div className="space-y-8">
                        {/* Deals Results */}
                        {deals.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-slate-900 mb-4 px-2">Nabídky letenek a zájezdů</h2>
                                <div className="grid gap-4">
                                    {deals.map((deal) => (
                                        <Link key={deal.id} href={deal.url} target="_blank" className="group bg-white p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all flex gap-4 items-center">
                                            <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-slate-100">
                                                {deal.image && <Image src={deal.image} alt={deal.title} fill className="object-cover" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${deal.type === 'package' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                        {deal.type === 'package' ? 'Zájezd' : 'Letenka'}
                                                    </span>
                                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" /> {deal.destination}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-slate-900 group-hover:text-blue-600 truncate">{deal.title}</h3>
                                                <p className="text-sm text-slate-500 truncate">{deal.description}</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <span className="block text-xl font-bold text-blue-600">{deal.price} Kč</span>
                                                {deal.originalPrice && <span className="text-sm text-slate-400 line-through">{deal.originalPrice} Kč</span>}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Static Content Results */}
                        {staticResults.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-slate-900 mb-4 px-2">Články a Průvodce</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {staticResults.map((page) => (
                                        <Link key={page.url} href={page.url} className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all overflow-hidden flex flex-col">
                                            <div className="relative h-40 w-full bg-slate-100">
                                                <Image src={page.image} alt={page.title} fill className="object-cover" />
                                            </div>
                                            <div className="p-4 flex-1 flex flex-col">
                                                <span className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">{page.type}</span>
                                                <h3 className="font-bold text-slate-900 mb-2 group-hover:text-blue-600">{page.title}</h3>
                                                <p className="text-sm text-slate-500 line-clamp-2 flex-1">{page.description}</p>
                                                <div className="mt-4 flex items-center text-blue-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                                                    Číst více <ArrowRight className="h-4 w-4 ml-1" />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                </div>
            </div>
        </main>
    );
}
