'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Plane, Lock } from 'lucide-react';
import { login } from '../auth-actions';

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setIsPending(true);

        try {
            const formData = new FormData(e.currentTarget);
            const result = await login(formData); // Calling Server Action directly

            if (result?.error) {
                setError(result.error);
                setIsPending(false);
            } else {
                // If no error returned, it likely redirected (or we can force it)
                // Note: redirect() in Server Action throws error that is caught by Next.js
                // but in explicit try/catch block we might catch it?
                // Actually redirect() throws NEXT_REDIRECT which we should NOT catch or should rethrow.
                // But server actions handle this... mostly.
                // To be safe, if we get here, we might manually redirect if needed, 
                // but checking connection first.
            }
        } catch (err: any) {
            // If it's a redirect error, we let it pass? 
            // In Next.js client handlers, server action redirects often just happen.
            // If we catch it, we might block the redirect.
            // But usually redirect() in SA happens on network response.
            // Let's assume complex error:
            console.error(err);
            // setIsPending(false); // Do not unset if redirecting
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="mb-8 flex items-center gap-2">
                <div className="p-3 bg-blue-600 rounded-xl">
                    <Plane className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-display font-bold text-blue-900">Flugi AdminF</h1>
            </div>

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">Přihlášení</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Heslo</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <input
                                name="password"
                                type="password"
                                required
                                placeholder="Zadejte heslo..."
                                className="w-full pl-9 pr-3 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <Button
                        disabled={isPending}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg shadow-lg shadow-blue-900/10"
                    >
                        {isPending ? 'Přihlašování...' : 'Přihlásit se'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
