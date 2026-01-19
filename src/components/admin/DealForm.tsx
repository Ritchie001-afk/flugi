'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { ExternalLink, Image as ImageIcon, Sparkles, Search, Save, X, Upload } from 'lucide-react';
import { createDeal, updateDeal, generateDescriptionAction, findImageAction } from '../../../app/admin/actions';
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

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', e.target.files[0]);

        try {
            // Dynamically import to avoid server-action serialization issues in client component if not careful, 
            // but we can import the action directly at the top if it's 'use server'
            const { uploadImageAction } = await import('../../../app/admin/upload-action'); // Adjusted path
            const res = await uploadImageAction(formData);

            if (res.error) {
                alert(res.error); // Using alert as toast is not defined
            } else if (res.url) {
                setImage(res.url); // Using setImage as form.setValue is not defined
                alert('Obrázek nahrán!'); // Using alert as toast is not defined
            }
        } catch (err) {
            console.error(err);
            alert('Chyba při nahrávání.'); // Using alert as toast is not defined
        } finally {
            setUploading(false);
        }
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
                            <div>
                                <label className="block text-xs font-bold text-blue-700 uppercase mb-1">Vstupní podmínky</label>
                                <input
                                    name="entryRequirements"
                                    type="text"
                                    defaultValue={initialData?.entryRequirements}
                                    placeholder="např. Vízum online"
                                    className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:border-blue-500 outline-none text-sm bg-white"
                                />
                            </div>
                        </div>
                    </div>
                )}

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
                <div className="grid grid-cols-2 gap-4">
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
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Odkaz na recenze</label>
                        <input
                            name="reviewUrl"
                            defaultValue={initialData?.reviewUrl}
                            placeholder="https://..."
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm"
                        />
                    </div>
                </div>
            </div>

            <Button variant="premium" className="w-full mt-2">
                <Save className="h-4 w-4 mr-2" />
                {initialData ? 'Uložit změny' : 'Vytvořit deal'}
            </Button>
        </form>
    );
}
