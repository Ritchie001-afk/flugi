
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { ExternalLink, Image as ImageIcon, Sparkles, Search, Save, X } from 'lucide-react';
import { createDeal, updateDeal, generateDescriptionAction, findImageAction } from '../../../app/admin/actions';
import Link from 'next/link';

interface DealFormProps {
    initialData?: any;
}

export default function DealForm({ initialData }: DealFormProps) {
    const [destination, setDestination] = useState(initialData?.destination || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [image, setImage] = useState(initialData?.image || '');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSearchingImage, setIsSearchingImage] = useState(false);

    // Reset state when initialData changes (e.g. clicking edit on different item)
    useEffect(() => {
        if (initialData) {
            setDestination(initialData.destination);
            setDescription(initialData.description || '');
            setImage(initialData.image);
        } else {
            // Reset form if no data (Create mode)
            setDestination('');
            setDescription('');
            setImage('');
        }
    }, [initialData]);

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

    const handleImageSearch = async () => {
        if (!destination) return alert('Nejdříve vyplňte destinaci!');
        setIsSearchingImage(true);
        const result = await findImageAction(destination);
        setIsSearchingImage(false);

        if (result.error || !result.url) {
            alert('Bohužel jsem nenašel vhodný obrázek v databázi.');
        } else if (result.url) {
            setImage(result.url);
        }
    };

    const handleManualUnsplashSearch = () => {
        if (!destination) return alert('Nejdříve vyplňte destinaci!');
        const query = encodeURIComponent(destination + ' travel info');
        window.open(`https://unsplash.com/s/photos/${query}`, '_blank');
    };

    const handleSubmit = async (formData: FormData) => {
        if (initialData) {
            await updateDeal(initialData.id, formData);
        } else {
            await createDeal(formData);
        }
    };

    return (
        <form action={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-700">
                    {initialData ? 'Upravit deal' : 'Nový deal'}
                </h3>
                {initialData && (
                    <Link href="/admin" className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                        <X className="h-3 w-3" /> Zrušit úpravy
                    </Link>
                )}
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Název</label>
                <input
                    name="title"
                    required
                    defaultValue={initialData?.title}
                    placeholder="např. Luxusní Dubaj 5*"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cena (Kč)</label>
                    <input
                        name="price"
                        type="number"
                        required
                        defaultValue={initialData?.price}
                        placeholder="15990"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm"
                    />
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
                        disabled={isGenerating}
                        className={`text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
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
                <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase">URL Obrázku</label>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleImageSearch}
                            disabled={isSearchingImage}
                            className={`text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium ${isSearchingImage ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            <ImageIcon className="h-3 w-3" />
                            {isSearchingImage ? 'Hledám...' : 'Autohledání'}
                        </button>
                        <button
                            type="button"
                            onClick={handleManualUnsplashSearch}
                            className="text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1 font-medium cursor-pointer"
                        >
                            <Search className="h-3 w-3" />
                            Najít na Unsplash
                        </button>
                    </div>
                </div>
                <div className="relative">
                    <ImageIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                        name="image"
                        required
                        placeholder="https://images.unsplash.com..."
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm font-mono text-slate-600"
                    />
                </div>
                {image && (
                    <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
                        <img src={image} alt="Preview" className="h-8 w-12 object-cover rounded" />
                        <span>Náhled</span>
                    </div>
                )}
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Affiliate Odkaz</label>
                <div className="relative">
                    <ExternalLink className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                        name="url"
                        required
                        defaultValue={initialData?.url}
                        placeholder="https://www.fischer.cz/..."
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm font-mono text-slate-600"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Typ nabídky</label>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <label className="flex-1 cursor-pointer">
                        <input
                            type="radio"
                            name="type"
                            value="package"
                            defaultChecked={!initialData || initialData.type === 'package'}
                            className="peer sr-only"
                        />
                        <div className="text-center py-1.5 text-xs font-medium text-slate-500 rounded-md peer-checked:bg-white peer-checked:text-blue-600 peer-checked:shadow-sm transition-all">
                            Zájezd
                        </div>
                    </label>
                    <label className="flex-1 cursor-pointer">
                        <input
                            type="radio"
                            name="type"
                            value="flight"
                            defaultChecked={initialData?.type === 'flight'}
                            className="peer sr-only"
                        />
                        <div className="text-center py-1.5 text-xs font-medium text-slate-500 rounded-md peer-checked:bg-white peer-checked:text-blue-600 peer-checked:shadow-sm transition-all">
                            Letenka
                        </div>
                    </label>
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tagy (oddělené čárkou)</label>
                <input
                    name="tags"
                    defaultValue={initialData?.tags?.join(', ')}
                    placeholder="All Inclusive, Pláž, Rodina"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm"
                />
            </div>

            <Button variant="premium" className="w-full mt-2">
                <Save className="h-4 w-4 mr-2" />
                {initialData ? 'Uložit změny' : 'Vytvořit deal'}
            </Button>
        </form>
    );
}
