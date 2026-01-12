
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Search, ArrowRight, CheckCircle2, Globe, ShieldCheck } from "lucide-react";
import prisma from "@/lib/db";

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch featured deals (flash deals or just latest 3)
  let featuredDeals = [];
  try {
    featuredDeals = await prisma.deal.findMany({
      where: {
        expiresAt: { gt: new Date() }
      },
      orderBy: { isFlashDeal: 'desc' }, // Flash deals first
      take: 3
    });
  } catch (e) {
    console.error("Failed to fetch featured deals:", e);
  }
  return (
    <main className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image/Video Placeholder - Blue gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 z-0" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 z-0"></div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white tracking-tight animate-fade-in-up">
            Létejte chytře. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Plaťte méně.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl animate-fade-in-up delay-100">
            Objevte exkluzivní letenky a luxusní dovolené vybrané pro moderní cestovatele. Poznávejte svět bez zbytečných výdajů.
          </p>

          {/* Search Box Mockup */}
          <div className="w-full max-w-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-2 rounded-2xl flex flex-col md:flex-row gap-2 animate-fade-in-up delay-200 shadow-2xl shadow-blue-900/20">
            <div className="flex-1 px-4 py-3 flex items-center gap-3 border-b md:border-b-0 md:border-r border-white/10">
              <Search className="h-5 w-5 text-blue-200" />
              <input
                type="text"
                placeholder="Kam se chcete vydat?"
                className="bg-transparent border-none outline-none text-white placeholder:text-blue-200 w-full"
              />
            </div>
            <Button variant="premium" size="lg" className="rounded-xl">
              Hledat nabídky
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Deals Section */}
      <section className="w-full py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900">Oblíbené destinace</h2>
            <Link href="/deals">
              <Button variant="ghost" className="text-blue-600 hover:text-blue-700 gap-2">
                Zobrazit vše <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredDeals.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-500">
                <p>Zatím žádné top nabídky. Podívejte se na všechny nabídky.</p>
              </div>
            ) : (
              featuredDeals.map((deal: any) => (
                <Link href={deal.url} key={deal.id} target="_blank" className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-white border border-slate-200 hover:border-blue-500/50 hover:shadow-xl transition-all duration-300">
                  {/* Image */}
                  {deal.image ? (
                    <div className="absolute inset-0">
                      <Image src={deal.image} alt={deal.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-slate-200 animate-pulse group-hover:animate-none group-hover:bg-slate-300 transition-colors" />
                  )}

                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full mb-3">
                        {deal.type === 'package' ? 'Zájezd' : 'Letenka'}
                      </span>
                      <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2">{deal.title}</h3>
                      <p className="text-blue-100 mb-4">{deal.description && deal.description.substring(0, 30)}...</p>
                      <div className="flex items-center justify-between">
                        <div>
                          {deal.originalPrice && (
                            <p className="text-xs text-slate-400 line-through">{deal.originalPrice.toLocaleString('cs-CZ')} Kč</p>
                          )}
                          <p className="text-xl font-bold text-white">{deal.price.toLocaleString('cs-CZ')} Kč</p>
                        </div>
                        <Button size="sm" variant="secondary" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          Zobrazit
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="w-full py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -z-10" />
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-6">Proč zvolit Flugi?</h2>
            <p className="text-slate-600">Prohledáváme internet a hledáme skryté poklady cestování. Žádné automatické roboty, jen ručně vybrané prémiové nabídky.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-lg transition-all">
              <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle2 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Ověřené nabídky</h3>
              <p className="text-slate-600">Každou nabídku manuálně ověřujeme, abychom zajistili její platnost a cenu.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-lg transition-all">
              <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <Globe className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Globální pokrytí</h3>
              <p className="text-slate-600">Od skrytých evropských pláží po exotická asijská útočiště, pokrýváme vše.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-lg transition-all">
              <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Žádné skryté poplatky</h3>
              <p className="text-slate-600">Jsme 100% transparentní. Cena, kterou vidíte, je cena, kterou zaplatíte u poskytovatele.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
