
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Badge } from 'lucide-react'; // Placeholder icon, we'll use text badges

export const metadata = {
    title: 'Magazín o cestování | Flugi',
    description: 'Nejnovější tipy, triky a inspirace pro vaše cesty.',
};

export default function MagazinePage() {
    return (
        <main className="min-h-screen bg-slate-50 pt-24 pb-20">
            <div className="container mx-auto px-4">
                <header className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-900 mb-6">
                        Flugi Magazín
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Inspirace pro vaše příští dobrodružství. Od tajných triků s letenkami po průvodce zapomenutými místy.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* Featured Article - Hidden City Ticketing */}
                    <Link href="/pruvodce/skryte-letenky-hidden-city-ticketing" className="col-span-1 lg:col-span-2 group relative h-[400px] rounded-3xl overflow-hidden block">
                        <Image
                            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop"
                            alt="Hidden City Ticketing"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8 md:p-12">
                            <span className="inline-block px-3 py-1 bg-purple-500/80 backdrop-blur-sm text-white text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
                                Tipy & Triky
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                                Jak najít skryté letenky (Hidden City Ticketing)
                            </h2>
                            <p className="text-slate-200 line-clamp-2 max-w-xl">
                                Objevte kontroverzní metodu, díky které můžete ušetřit tisíce korun na letenkách. Aerolinky ji nenávidí, cestovatelé milují.
                            </p>
                        </div>
                    </Link>

                    {/* Article 1 */}
                    <Link href="/magazin/5-nejkrasnejsich-jezer-svycarska" className="group relative h-[400px] rounded-3xl overflow-hidden block bg-white border border-slate-200 flex flex-col">
                        <div className="relative h-48 overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop"
                                alt="Švýcarsko"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full mb-4 w-fit uppercase tracking-wider">
                                Destinace
                            </span>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                                5 nejkrásnějších jezer ve Švýcarsku
                            </h3>
                            <p className="text-slate-500 text-sm line-clamp-3 mb-4 flex-1">
                                Švýcarsko není jen o horách. Objevte tyrkysová jezera, která vypadají jako z Karibiku, ale jsou jen pár hodin cesty autem.
                            </p>
                            <span className="text-blue-600 font-bold text-sm">Číst více →</span>
                        </div>
                    </Link>

                    {/* Placeholder Article 2 - Airport Guides Link */}
                    <Link href="/pruvodce" className="group relative h-[400px] rounded-3xl overflow-hidden block bg-blue-600 flex flex-col justify-center items-center text-center p-8">
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                        <h3 className="text-3xl font-bold text-white mb-4 relative z-10">
                            Průvodce letišti
                        </h3>
                        <p className="text-blue-100 mb-8 relative z-10 max-w-sm mx-auto">
                            Odletáte z Prahy, Vídně nebo Krakova? Podívejte se na naše detailní průvodce parkováním a dopravou.
                        </p>
                        <Button variant="secondary" className="relative z-10">
                            Přejít na průvodce
                        </Button>
                    </Link>
                </div>
            </div>
        </main>
    );
}
