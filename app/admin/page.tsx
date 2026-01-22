import prisma from '@/lib/db';
import DeleteDealButton from '@/components/admin/DeleteDealButton';
import DealForm from '@/components/admin/DealForm';
import { deleteAllDeals } from './deal-actions';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    const deals = await prisma.deal.findMany({
        select: { id: true, title: true, price: true, destination: true },
        orderBy: { createdAt: 'desc' },
        take: 50
    });

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 className="text-2xl font-bold">Administrace Zájezdů</h1>
                <form action={deleteAllDeals}>
                    <button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-bold transition-colors"
                    // Note: Standard form submission for emergency nuke
                    >
                        ⚠️ SMAZAT VŠECHNY ({deals.length})
                    </button>
                    <div className="text-[10px] text-slate-400 mt-1 text-right">
                        (Nebo použij /api/nuke)
                    </div>
                </form>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Form */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-lg font-bold mb-4">Přidat nový deal</h2>
                    <DealForm />
                </div>

                {/* Right: List */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-lg font-bold mb-4">Seznam aktivních ({deals.length})</h2>
                    <div className="space-y-2">
                        {deals.map(deal => (
                            <div key={deal.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                <div>
                                    <div className="font-medium text-slate-800">{deal.title || 'Bez názvu'}</div>
                                    <div className="text-xs text-slate-500">
                                        {deal.destination || 'Neznámo'} • {deal.price ? `${deal.price} Kč` : 'Cena neuvedena'}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <small className="text-slate-300 font-mono text-[10px]">{deal.id.substring(deal.id.length - 6)}</small>
                                    <DeleteDealButton id={deal.id} />
                                </div>
                            </div>
                        ))}
                        {deals.length === 0 && (
                            <div className="text-center text-slate-400 py-10">
                                Žádné zájezdy. Přidejte nový formulářem vlevo.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
