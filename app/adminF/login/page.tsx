'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/Button';
import { Plane, Lock } from 'lucide-react';
import { login } from '../auth-actions';

// Initial state for the form action
const initialState = {
    error: '',
};

export default function LoginPage() {
    // useActionState handles the pending state and result automatically
    // It captures the error returned by the server action without crashing on redirect
    const [state, formAction, isPending] = useActionState(login, initialState);

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

                {state?.error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center font-medium">
                        {state.error}
                    </div>
                )}

                <form action={formAction} className="space-y-4">
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
