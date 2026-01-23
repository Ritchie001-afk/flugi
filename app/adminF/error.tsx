'use client';

// Suspended error boundary
export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="p-8">
            <h2 className="text-xl font-bold text-red-600 mb-4">Chyba v administraci</h2>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-sm font-mono text-red-800 whitespace-pre-wrap">
                {error.message}
            </div>
            <div className="mt-4 text-xs text-slate-500">
                Digest: {error.digest}
            </div>
            <button
                onClick={reset}
                className="mt-4 px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700"
            >
                Zkusit znovu
            </button>
        </div>
    );
}
