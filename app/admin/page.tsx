
import { logout } from './auth-actions';
import { Button } from '@/components/ui/Button';
import prisma from '@/lib/db';
import { Trash2, ExternalLink, LogOut, Plus, Image as ImageIcon, Pencil } from 'lucide-react';
import DealForm from '@/components/admin/DealForm';
import DeleteDealButton from '@/components/admin/DeleteDealButton';
import Link from 'next/link';

export const revalidate = 0; // Always fresh data for admin

interface AdminPageProps {
    searchParams: Promise<{ edit?: string }>;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
    try {
        const params = await searchParams;
        const deals = await prisma.deal.findMany({
            select: {
                id: true,
                title: true,
                price: true,
                type: true,
                destination: true,
                // image: false // Explicitly NOT selecting image
            },
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        let editDeal = null;
        if (params.edit) {
            const rawDeal = await prisma.deal.findUnique({
                where: { id: params.edit }
            });

            // SANITIZATION: Serialize to JSON to prevent "Server Components render" error with Date objects
            if (rawDeal) {
                editDeal = JSON.parse(JSON.stringify(rawDeal));
            }

            // Additional cleanup
            if (editDeal) {
                if (editDeal.image && editDeal.image.startsWith('data:')) editDeal.image = '';
                // Fix: properly type map argument
                if (editDeal.images) {
                    editDeal.images = editDeal.images.filter((img: string) => !img.startsWith('data:'));
                }
            }
        }

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
                                    {editDeal ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                                </div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    {editDeal ? 'Upravit deal' : 'Přidat nový deal'}
                                </h2>
                            </div>

                            {/* Interactive Client Component Form */}
                            {/* <DealForm initialData={editDeal} /> */}
                            <div className="p-4 bg-yellow-100 text-yellow-800 rounded">Formulář dočasně deaktivován pro debug</div>

                            <div className="mt-8 border-t border-slate-100 pt-4">
                                {/* <form action={async () => {
                                    'use server';
                                    const { cleanupImagesAction } = await import('./cleanup-action');
                                    await cleanupImagesAction();
                                }}>
                                    <button className="text-xs text-red-400 hover:text-red-600 underline">
                                        Nouzová oprava DB (Smazat Base64 obrázky)
                                    </button>
                                </form> */}
                            </div>
                        </div>
                    </div>

                    {/* List Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h2 className="font-bold text-slate-700">Posledních 50 položek</h2>
                                <span className="text-xs font-mono bg-slate-200 px-2 py-1 rounded text-slate-600">{deals?.length || 0} deals</span>
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
                                        {deals?.map(deal => (
                                            <tr key={deal.id} className={`hover:bg-slate-50 transition-colors group ${params.edit === deal.id ? 'bg-blue-50' : ''}`}>
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
                                                    <div className="flex justify-end items-center gap-1">
                                                        <Link
                                                            href={`/admin?edit=${deal.id}`}
                                                            className="text-slate-400 hover:text-blue-600 p-1 rounded hover:bg-blue-50 transition-all"
                                                            title="Upravit"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Link>
                                                        <DeleteDealButton id={deal.id} />
                                                    </div>
                                                </td>
                                            </tr>
                                        )) || []}
                                        {(deals?.length || 0) === 0 && (
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
    } catch (e: any) {
        console.error("Admin Page Render Error:", e);
        return (
            <div className="p-8 text-red-600 bg-red-50 min-h-screen">
                <h1 className="text-2xl font-bold mb-4">Chyba při načítání administrace</h1>
                <pre className="bg-white p-4 rounded border border-red-200 overflow-auto">
                    {e.message}<br />
                    {e.stack}
                </pre>
            </div>
        );
    }
}
