import prisma from '@/lib/db';
import DeleteDealButton from '@/components/admin/DeleteDealButton';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    const deals = await prisma.deal.findMany({
        select: { id: true, title: true },
        orderBy: { createdAt: 'desc' },
        take: 10
    });

    return (
        <div style={{ padding: '50px', marginTop: '100px', fontFamily: 'sans-serif' }}>
            <h1>Deep Debug: Phase 1 - Data Fetching</h1>
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
