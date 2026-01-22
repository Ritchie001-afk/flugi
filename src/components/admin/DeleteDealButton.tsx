'use client';

import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DeleteDealButtonProps {
    id: string;
}

export default function DeleteDealButton({ id }: DeleteDealButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm('Opravdu smazat tento deal?')) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/deals/${id}`, {
                method: 'DELETE'
            });
            const json = await res.json();

            if (!res.ok) throw new Error(json.error || 'Failed to delete');

            // Refresh to show changes
            router.refresh();
        } catch (e: any) {
            console.error("Delete failed:", e);
            alert("Chyba při mazání: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-all disabled:opacity-50"
            title="Smazat"
        >
            <Trash2 className="h-4 w-4" />
        </button>
    );
}
