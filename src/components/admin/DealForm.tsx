'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { ExternalLink, Image as ImageIcon, Sparkles, Search, Save, X, Upload, Plane } from 'lucide-react';
import { useRouter } from 'next/navigation';
// import { createDeal, updateDeal } from '../../../app/admin/deal-actions';
// import { generateDescriptionAction, findImageAction, generateEntryRequirementsAction, generateImageWithGeminiAction, uploadImageAction } from '../../../app/admin/actions';
import { findImageAction, uploadImageAction } from '../../../app/adminF/actions';
import Link from 'next/link';

interface DealFormProps {
    initialData?: any;
}

export default function DealForm({ initialData }: DealFormProps) {
    const [destination, setDestination] = useState(initialData?.destination || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [image, setImage] = useState(initialData?.image || '');
    const [images, setImages] = useState<string[]>(initialData?.images || []);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSearchingImage, setIsSearchingImage] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [type, setType] = useState(initialData?.type || 'flight');
    const [datePublished, setDatePublished] = useState(initialData?.datePublished ? new Date(initialData.datePublished).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
    const [availableDates, setAvailableDates] = useState(initialData?.availableDates || '');

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

    const router = useRouter();

    const handleGenerate = async () => {
        if (!destination) return alert('Nejdříve vyplňte destinaci!');
        setIsGenerating(true);
        try {
            const res = await fetch('/api/admin/ai/text', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'description', destination })
            });
            const result = await res.json();

            if (result.error) {
                alert(result.error);
            } else if (result.text) {
                setDescription(result.text);
            }
        } catch (e: any) {
            console.error(e);
            alert("Chyba při generování: " + e.message);
        } finally {
            setIsGenerating(false);
        }
    };

    // Placeholder for removeImage (unchanged)
    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
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

    const handleAIGenerate = async () => {
        if (!destination) return alert('Vyplňte destinaci');
        setUploading(true);
        try {
            // Call API endpoint instead of server action
            const res = await fetch('/api/admin/ai/image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ destination })
            });
            const data = await res.json();

            if (data.error) {
                console.error(data.error);
                alert(data.error);
            } else if (data.url) {
                setImages(prev => [...prev, data.url!]);
                setImage(data.url!); // Always update main image to the new one
            }
        } catch (error: any) {
            console.error("AI Generation FE Error:", error);
            alert(`Chyba při komunikaci se serverem: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Limit file size (e.g. 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return alert('Soubor je příliš velký (max 5MB).');
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await uploadImageAction(formData);

            if (res.error) {
                alert(res.error);
            } else if (res.url) {
                setImages(prev => [...prev, res.url!]);
                if (!image) setImage(res.url!);
            }
        } catch (error: any) {
            console.error(error);
            alert('Chyba při nahrávání souboru. Zkuste to znovu.');
        } finally {
            setUploading(false);
            // Reset input value to allow selecting same file again if needed
            e.target.value = '';
        }
    };

    const findImage = async () => {
        if (!destination) return alert('Vyplňte destinaci');
        setUploading(true);
        const res = await findImageAction(destination);
        setUploading(false);
        if (res.url) {
            setImages(prev => [...prev, res.url]);
            if (!image) setImage(res.url); // Set as main if empty
        } else {
            alert(res.error);
        }
    };

    const handleSubmit = async (formData: FormData) => {
        try {
            // Convert FormData to JSON
            const data: any = {};
            formData.forEach((value, key) => {
                // Special handling for tags - convert comma-separated string to array
                if (key === 'tags' && typeof value === 'string') {
                    data[key] = value.split(',').map(t => t.trim()).filter(Boolean);
                } else {
                    data[key] = value;
                }
            });
            // Add state values explicitly
            data.images = images;
            data.availableDates = availableDates;
            data.datePublished = datePublished;

            let url = '/api/deals';
            let method = 'POST';

            if (initialData) {
                url = `/api/deals/${initialData.id}`;
                method = 'PATCH';
            }

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const json = await res.json();

            if (!res.ok) {
                alert(json.error || 'Chyba při ukládání.');
            } else {
                alert('Uloženo!');
                // Reset form or redirect
                router.refresh(); // Refresh in both cases (edit or create)
                if (!initialData) {
                    setImage('');
                    setType('flight');
                    setDatePublished(new Date().toISOString().split('T')[0]);
                    setAvailableDates('');
                }
            }
        } catch (e: any) {
            console.error(e);
            alert(`Chyba: ${e.message}`);
        }
    };

    return (
        <form action={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-700">
                    {initialData ? 'Upravit deal' : 'Nový deal'}
                </h3>
                {initialData && (
                    <Link href="/adminF" className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                        <X className="h-3 w-3" /> Zrušit úpravy
                    </Link>
                )}
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Název <span className="text-red-500">*</span></label>
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
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Typ nabídky</label>
                    <select
                        name="type"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm bg-white"
                        defaultValue={initialData?.type || 'flight'}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="flight">Letenka</option>
                        <option value="package">Zájezd</option>
                    </select>
                </div>

                {/* Flight Specific Fields */}
                {type === 'flight' && (
                    <div className="col-span-2 bg-blue-50/50 p-6 rounded-xl border border-blue-100 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-blue-600 bg-blue-100 p-1.5 rounded-lg"><Plane className="h-4 w-4" /></span>
                            <h3 className="font-bold text-blue-900 text-sm">Detaily letu</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-blue-700 uppercase mb-1">Letecká společnost</label>
                                <input
                                    name="airline"
                                    type="text"
                                    defaultValue={initialData?.airline}
                                    placeholder="např. Emirates"
                                    className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:border-blue-500 outline-none text-sm bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-blue-700 uppercase mb-1">Počet přestupů</label>
                                <input
                                    name="transferCount"
                                    type="number"
                                    defaultValue={initialData?.transferCount ?? 0}
                                    placeholder="0 = Přímý let"
                                    className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:border-blue-500 outline-none text-sm bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-blue-700 uppercase mb-1">Zavazadla</label>
                                <input
                                    name="baggageInfo"
                                    type="text"
                                    defaultValue={initialData?.baggageInfo}
                                    placeholder="např. 20kg odbavené"
                                    className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:border-blue-500 outline-none text-sm bg-white"
                                />
                            </div>

                        </div>
                    </div>
                )}

                {/* General Fields for all types */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex justify-between">
                        Vstupní podmínky
                        <button
                            type="button"
                            onClick={async () => {
                                if (!destination) return alert('Vyplňte destinaci');
                                try {
                                    const res = await fetch('/api/admin/ai/text', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ type: 'requirements', destination })
                                    });
                                    const result = await res.json();
                                    if (result.text) {
                                        const input = document.getElementsByName('entryRequirements')[0] as HTMLInputElement;
                                        if (input) input.value = result.text;
                                    } else {
                                        alert(result.error || "Neznámá chyba");
                                    }
                                } catch (e: any) {
                                    alert("Chyba: " + e.message);
                                }
                            }}
                            className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                        >
                            <Sparkles className="h-3 w-3" /> AI
                        </button>
                    </label>
                    <input
                        name="entryRequirements"
                        type="text"
                        defaultValue={initialData?.entryRequirements}
                        placeholder="např. Vízum online, Pas min 6 měsíců..."
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm bg-white"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tagy (oddělené čárkou)</label>
                    <input
                        name="tags"
                        placeholder="All Inclusive, Pláž, Relax"
                        defaultValue={initialData?.tags?.join(', ')}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cena (Kč) <span className="text-red-500">*</span></label>
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
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Běžná cena (Kč) - nepovinné</label>
                    <input
                        name="originalPrice"
                        type="number"
                        defaultValue={initialData?.originalPrice}
                        placeholder="20990 (pro výpočet slevy)"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Datum od (Tam)</label>
                    <input
                        name="startDate"
                        type="date"
                        defaultValue={initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : ''}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm bg-white"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Datum do (Zpět)</label>
                    <input
                        name="endDate"
                        type="date"
                        defaultValue={initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : ''}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm bg-white"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Další termíny (text)</label>
                    <textarea
                        name="availableDates"
                        value={availableDates}
                        onChange={(e) => setAvailableDates(e.target.value)}
                        placeholder="Např. 10.2. - 17.2., 5.3 - 12.3..."
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm h-[42px]"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Datum zveřejnění</label>
                    <input
                        name="datePublished"
                        type="date"
                        value={datePublished}
                        onChange={(e) => setDatePublished(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm bg-white"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Destinace <span className="text-red-500">*</span></label>
                <input
                    name="destination"
                    required
                    placeholder="Maledivy"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm"
                />
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

            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-amber-800 uppercase">Počasí & Klima</label>
                    <button
                        type="button"
                        onClick={async () => {
                            if (!destination) return alert('Vyplňte destinaci');
                            const sDate = document.getElementsByName('startDate')[0] as HTMLInputElement;
                            const eDate = document.getElementsByName('endDate')[0] as HTMLInputElement;

                            try {
                                const res = await fetch('/api/admin/ai/text', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        type: 'weather',
                                        destination,
                                        startDate: sDate?.value,
                                        endDate: eDate?.value
                                    })
                                });
                                const result = await res.json();
                                if (result.text) {
                                    const input = document.getElementsByName('weatherInfo')[0] as HTMLTextAreaElement;
                                    if (input) input.value = result.text;
                                } else {
                                    alert(result.error || "Neznámá chyba");
                                }
                            } catch (e: any) {
                                alert("Chyba: " + e.message);
                            }
                        }}
                        className="text-amber-600 hover:text-amber-800 flex items-center gap-1 font-medium text-[10px] cursor-pointer"
                    >
                        <Sparkles className="h-3 w-3" /> VYGENEROVAT POČASÍ
                    </button>
                </div>
                <textarea
                    name="weatherInfo"
                    rows={2}
                    defaultValue={initialData?.weatherInfo}
                    placeholder="Např. V dubnu je v destinaci Dubaj průměrně 30°C, slunečno..."
                    className="w-full px-3 py-2 rounded-lg border border-amber-200 focus:border-amber-500 outline-none text-sm bg-white"
                />
            </div>

            <div>
                <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase">URL Obrázku <span className="text-red-500">*</span></label>
                </div>
                <div className="flex gap-2 mb-2">
                    <input
                        type="url"
                        name="image"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="URL hlavního obrázku"
                        className="flex-1 px-3 py-2 rounded-lg border border-blue-200 focus:border-blue-500 outline-none text-sm bg-white"
                    />
                    <div className="flex gap-1">
                        <Button type="button" onClick={findImage} variant="outline" size="icon" title="Najít v databázi (Unsplash)">
                            <Search className="h-4 w-4" />
                        </Button>
                        <Button type="button" onClick={handleAIGenerate} variant="outline" size="icon" className="text-purple-600 border-purple-200 hover:bg-purple-50" title="Vygenerovat AI obrázek">
                            <Sparkles className="h-4 w-4" />
                        </Button>
                        <label className={`cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                            <div className="h-9 w-9 flex items-center justify-center rounded-lg border border-blue-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors">
                                {uploading ? <span className="animate-spin">⏳</span> : <Upload className="h-4 w-4" />}
                            </div>
                        </label>
                    </div>
                </div>

                {/* Image Gallery Preview */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                    {images.map((img, idx) => (
                        <div key={idx} className="relative group aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="absolute top-1 right-1 bg-white/90 text-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                            >
                                <X className="h-3 w-3" />
                            </button>
                            {img === image && (
                                <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                                    HLAVNÍ
                                </div>
                            )}
                            {img !== image && (
                                <button
                                    type="button"
                                    onClick={() => setImage(img)}
                                    className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 font-bold text-xs"
                                >
                                    Nastavit jako hlavní
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Affiliate Odkaz <span className="text-red-500">*</span></label>
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

            {/* Review Section */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <span className="text-yellow-500">★</span> Recenze & Hodnocení
                </h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hodnocení (0-10)</label>
                        <input
                            name="rating"
                            type="number"
                            step="0.1"
                            max="10"
                            defaultValue={initialData?.rating}
                            placeholder="e.g. 9.2"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Počet recenzí</label>
                        <input
                            name="reviewCount"
                            type="number"
                            defaultValue={initialData?.reviewCount}
                            placeholder="e.g. 150"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Zdroj Recenzí</label>
                        <select
                            name="reviewSource"
                            defaultValue={initialData?.reviewSource || ""}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm bg-white"
                        >
                            <option value="">-- Žádný --</option>
                            <option value="Google">Google</option>
                            <option value="TripAdvisor">TripAdvisor</option>
                            <option value="TrustPilot">TrustPilot</option>
                            <option value="Invia">Invia</option>
                            <option value="Booking">Booking.com</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex justify-between">
                            Odkaz na recenze
                            <button
                                type="button"
                                onClick={async () => {
                                    const urlInput = document.getElementsByName('reviewUrl')[0] as HTMLInputElement;
                                    const url = urlInput?.value;
                                    if (!url) return alert('Vyplňte URL recenzí (TripAdvisor)');

                                    // Dynamic import or safe call
                                    try {
                                        setUploading(true);
                                        // Importing server action dynamically or passing it via props is cleaner, but here we invoke via a wrapper api or direct import if supported
                                        // Since we can't easily import server action in client component without 'use server' props or separation, 
                                        // we'll use a new API route for scraping to avoid build issues with server actions in client components if not set up perfectly.
                                        // OR: We simply assume `scrapeTripAdvisor` makes it through boundaries if used in a Server Component wrapper. 
                                        // BUT `DealForm` is `use client`. So we need to call it via a prop OR separate API.
                                        // EASIEST FIX: Use the existing pattern - create a small API endpoint for scraping.

                                        // NOTE: I will implement a quick API route /api/admin/scrape for this button to work reliably
                                        const res = await fetch('/api/admin/scrape', {
                                            method: 'POST',
                                            body: JSON.stringify({ url }),
                                            headers: { 'Content-Type': 'application/json' }
                                        });
                                        const json = await res.json();

                                        if (json.error) {
                                            alert(json.error);
                                        } else {
                                            // Auto-fill fields
                                            if (json.data.rating) {
                                                const rInput = document.getElementsByName('rating')[0] as HTMLInputElement;
                                                if (rInput) rInput.value = json.data.rating;
                                            }
                                            if (json.data.reviewCount) {
                                                const cInput = document.getElementsByName('reviewCount')[0] as HTMLInputElement;
                                                if (cInput) cInput.value = json.data.reviewCount;
                                            }
                                            if (json.data.featuredReviewText) {
                                                const tInput = document.getElementsByName('featuredReviewText')[0] as HTMLTextAreaElement;
                                                if (tInput) tInput.value = json.data.featuredReviewText;
                                            }
                                            // Images handling if needed...
                                            alert('Data načtena! Zkontrolujte pole.');
                                        }
                                    } catch (e: any) {
                                        alert('Chyba: ' + e.message);
                                    } finally {
                                        setUploading(false);
                                    }
                                }}
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-bold text-[10px]"
                            >
                                <Search className="h-3 w-3" /> NAČÍST DATA
                            </button>
                        </label>
                        <input
                            name="reviewUrl"
                            defaultValue={initialData?.reviewUrl}
                            placeholder="https://www.tripadvisor.com/..."
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm"
                        />
                    </div>
                </div>

                {/* New Featured Review Fields */}
                <div className="space-y-3 pt-3 border-t border-slate-200">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hlavní Recenze - Text (Česky)</label>
                        <textarea
                            name="featuredReviewText"
                            rows={3}
                            defaultValue={initialData?.featuredReviewText}
                            placeholder="'Naprosto úžasný hotel, skvělé jídlo...'"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm italic"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Autor Recenze</label>
                        <input
                            name="featuredReviewAuthor"
                            defaultValue={initialData?.featuredReviewAuthor}
                            placeholder="Jana, Praha"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Hidden Input for Images Array */}
            <input type="hidden" name="images" value={JSON.stringify(images)} />

            <Button variant="premium" className="w-full mt-2">
                <Save className="h-4 w-4 mr-2" />
                {initialData ? 'Uložit změny' : 'Vytvořit deal'}
            </Button>
        </form>
    );
}
