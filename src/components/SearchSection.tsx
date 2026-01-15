'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, Calendar, MapPin, Banknote, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function SearchSection() {
    const router = useRouter();
    const [mode, setMode] = useState<'classic' | 'ai'>('ai');
    const [isLoading, setIsLoading] = useState(false);

    // AI State
    const [aiQuery, setAiQuery] = useState('');

    // Classic State
    const [destination, setDestination] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    // AI Search Handler
    const handleAiSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!aiQuery.trim()) return;

        setIsLoading(true);
        try {
            const response = await fetch('/api/search/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: aiQuery }),
            });
            const data = await response.json();

            if (data.filters) {
                // Construct URL params
                const params = new URLSearchParams();
                if (data.filters.destination) params.set('destination', data.filters.destination);
                if (data.filters.maxPrice) params.set('maxPrice', data.filters.maxPrice.toString());
                if (data.filters.minPrice) params.set('minPrice', data.filters.minPrice.toString());
                if (data.filters.tags && data.filters.tags.length > 0) params.set('tags', data.filters.tags.join(','));

                router.push(`/deals?${params.toString()}`);
            }
        } catch (error) {
            console.error('Search failed', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Classic Search Handler
    const handleClassicSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (destination) params.set('destination', destination);
        if (maxPrice) params.set('maxPrice', maxPrice);
        router.push(`/deals?${params.toString()}`);
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
            {/* Tabs */}
            <div className="flex border-b border-slate-100">
                <button
                    onClick={() => setMode('ai')}
                    className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${mode === 'ai' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <Sparkles className="h-4 w-4" /> AI Hledání
                </button>
                <button
                    onClick={() => setMode('classic')}
                    className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${mode === 'classic' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <Search className="h-4 w-4" /> Klasické filtry
                </button>
            </div>

            <div className="p-6">
                {mode === 'ai' ? (
                    <form onSubmit={handleAiSearch} className="relative">
                        <textarea
                            value={aiQuery}
                            onChange={(e) => setAiQuery(e.target.value)}
                            placeholder="Např.: Chci s rodinou k moři do 25 000 Kč, nejlépe v červenci..."
                            className="w-full h-24 p-4 pr-32 text-lg rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-slate-700 placeholder:text-slate-400 resize-none bg-slate-50 focus:bg-white transition-colors"
                        />
                        <div className="absolute bottom-4 right-4">
                            <Button type="submit" variant="premium" disabled={isLoading} className="shadow-lg shadow-blue-500/20">
                                {isLoading ? (
                                    <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Přemýšlím...</>
                                ) : (
                                    <><Sparkles className="h-4 w-4 mr-2" /> Najít dovolenou</>
                                )}
                            </Button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleClassicSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Kam?</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    placeholder="Egypt, Turecko..."
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Kdy?</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="date"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-slate-600"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Cena do</label>
                            <div className="relative">
                                <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="number"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    placeholder="20 000"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex items-end">
                            <Button type="submit" variant="default" className="w-full h-[46px]">
                                <Search className="h-4 w-4 mr-2" /> Hledat
                            </Button>
                        </div>
                    </form>
                )}
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                <span className="font-bold text-blue-600">TIP:</span>
                {mode === 'ai' ? 'Zkuste být konkrétní – AI rozumí i požadavkům jako "blízko letiště" nebo "s tobogány".' : 'Pro více filtrů přejděte na stránku se všemi nabídkami.'}
            </div>
        </div>
    );
}
