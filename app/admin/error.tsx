'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Admin Error Boundary caught:', error);
    }, [error]);

    return (
        <div className="p-8 text-center text-red-600 bg-red-50 min-h-screen flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-4">Něco se pokazilo v administraci</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-red-200 max-w-2xl w-full text-left overflow-auto mb-6">
                <p className="font-bold mb-2">Chyba:</p>
                <pre className="text-sm whitespace-pre-wrap font-mono text-red-800">
                    {error.message || 'Neznámá kritická chyba'}
                </pre>
                {error.stack && (
                    <details className="mt-4">
                        <summary className="cursor-pointer text-xs text-slate-500">Zobrazit detaily (Stack Trace)</summary>
                        <pre className="text-xs text-slate-500 mt-2 whitespace-pre-wrap">{error.stack}</pre>
                    </details>
                )}
                {error.digest && <p className="text-xs text-slate-500 mt-4 font-mono border-t pt-2">Digest: {error.digest}</p>}
            </div>
            <button
                onClick={() => reset()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
                Zkusit znovu
            </button>
        </div>
    );
}
