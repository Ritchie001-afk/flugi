import prisma from '@/lib/db';
import DeleteDealButton from '@/components/admin/DeleteDealButton';
import { deleteAllDeals } from './deal-actions';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    const deals = await prisma.deal.findMany({
        select: { id: true, title: true },
        orderBy: { createdAt: 'desc' },
        take: 50
    });

    return (
        <div style={{ padding: '50px', marginTop: '100px', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Deep Debug: Phase 3 - Cleanup</h1>
                <form action={deleteAllDeals}>
                    <button
                        type="submit"
                        style={{
                            padding: '10px 20px',
                            backgroundColor: 'red',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        ⚠️ SMAZAT VŠECHNY ({deals.length})
                    </button>
                </form>
            </div>

            <p>Database Connection Test (Prisma)</p>

            <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
                <h2>Nalezené zájezdy ({deals.length})</h2>
                <ul>
                    {deals.map(deal => (
                        <li key={deal.id} style={{ margin: '10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ flex: 1 }}>{deal.title} <small>({deal.id})</small></span>
                            <DeleteDealButton id={deal.id} />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
