
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ExternalLink, Image as ImageIcon, Sparkles } from 'lucide-react';
import { createDeal, generateDescriptionAction } from '@/app/admin/actions';

export default function DealForm() {
    const [destination, setDestination] = useState('');
    const [description, setDescription] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        if (!destination) return alert('Nejdříve vyplňte destinaci!');
        setIsGenerating(true);
        const result = await generateDescriptionAction(destination);
        setIsGenerating(false);

        if (result.error) {
            alert(result.error);
        } else if (result.text) {
            setDescription(result.text);
        }
    };

    return (
        <form action={createDeal} className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Název</label>
                <input name="title" required placeholder="např. Luxusní Dubaj 5*" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cena (Kč)</label>
                    <input name="price" type="number" required placeholder="15990" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Destinace</label>
                    <input
                        name="destination"
                        required
                        placeholder="Maledivy"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm"
                    />
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase">Popis</label>
                    <button
                        type="button"
                        onClick={handleGenerate}
                        disabled={!destination || isGenerating}
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Sparkles className="h-3 w-3" />
                        {isGenerating ? 'Generuji...' : 'Vygenerovat AI'}
                    </button>
                </div>
                <textarea
                    name="description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Popis cesty (vyplňte ručně nebo vygenerujte AI)..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">URL Obrázku</label>
                <div className="relative">
                    <ImageIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input name="image" required placeholder="https://images.unsplash.com..." className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm font-mono text-slate-600" />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Affiliate Odkaz</label>
                <div className="relative">
                    <ExternalLink className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input name="url" required placeholder="https://www.fischer.cz/..." className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm font-mono text-slate-600" />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Typ nabídky</label>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <label className="flex-1 cursor-pointer">
                        <input type="radio" name="type" value="package" defaultChecked className="peer sr-only" />
                        <div className="text-center py-1.5 text-xs font-medium text-slate-500 rounded-md peer-checked:bg-white peer-checked:text-blue-600 peer-checked:shadow-sm transition-all">
                            Zájezd
                        </div>
                    </label>
                    <label className="flex-1 cursor-pointer">
                        <input type="radio" name="type" value="flight" className="peer sr-only" />
                        <div className="text-center py-1.5 text-xs font-medium text-slate-500 rounded-md peer-checked:bg-white peer-checked:text-blue-600 peer-checked:shadow-sm transition-all">
                            Letenka
                        </div>
                    </label>
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tagy (oddělené čárkou)</label>
                <input name="tags" placeholder="All Inclusive, Pláž, Rodina" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm" />
            </div>

            <Button variant="premium" className="w-full mt-2">
                Uložit s AI popisem
            </Button>
        </form>
    );
}
