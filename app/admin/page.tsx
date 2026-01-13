
import { createDeal, deleteDeal, logout } from './actions';
import { Button } from '@/components/ui/Button';
import prisma from '@/lib/db';
import { Trash2, ExternalLink, LogOut, Plus, Image as ImageIcon } from 'lucide-react';

export const revalidate = 0; // Always fresh data for admin

export default async function AdminPage() {
    const deals = await prisma.deal.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50
    });

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="font-bold text-xl text-blue-900 font-display">Flugi Admin</div>
                    <form action={logout}>
                        <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 transition-colors">
                            <LogOut className="h-4 w-4" /> Odhlásit se
                        </button>
                    </form>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                <Plus className="h-5 w-5" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">Přidat nový deal</h2>
                        </div>

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
                                    <input name="destination" required placeholder="Maledivy" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">URL Obrázku</label>
                                <div className="relative">
                                    <ImageIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <input name="image" required placeholder="https://images.unsplash.com..." className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm font-mono text-slate-600" />
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1">Tip: Použijte Unsplash.com pro hezké fotky.</p>
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
                                Uložit do databáze
                            </Button>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="font-bold text-slate-700">Posledních 50 položek</h2>
                            <span className="text-xs font-mono bg-slate-200 px-2 py-1 rounded text-slate-600">{deals.length} deals</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Název</th>
                                        <th className="px-4 py-3 font-medium">Cena</th>
                                        <th className="px-4 py-3 font-medium">Typ</th>
                                        <th className="px-4 py-3 font-medium text-right">Akce</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {deals.map(deal => (
                                        <tr key={deal.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-slate-900 truncate max-w-[200px] sm:max-w-[300px]" title={deal.title}>
                                                    {deal.title}
                                                </div>
                                                <div className="text-xs text-slate-500 truncate max-w-[200px]">
                                                    {deal.destination}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 font-mono text-slate-600">
                                                {deal.price.toLocaleString('cs-CZ')}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${deal.type === 'package'
                                                        ? 'bg-orange-100 text-orange-700'
                                                        : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {deal.type === 'package' ? 'Zájezd' : 'Letenka'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <form action={deleteDeal.bind(null, deal.id)}>
                                                    <button className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-all" title="Smazat">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </form>
                                            </td>
                                        </tr>
                                    ))}
                                    {deals.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-8 text-center text-slate-500 italic">
                                                Zatím žádné deally. Přidejte první vlevo!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
