
import { login } from '../actions';
import { Button } from '@/components/ui/Button';
import { Plane } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border border-slate-100">

                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-blue-100 rounded-full">
                        <Plane className="h-8 w-8 text-blue-600" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">Flugi Admin</h1>
                <p className="text-center text-slate-500 mb-8">Přihlášení do administrace</p>

                <form action={login} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Heslo</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <Button variant="premium" className="w-full">
                        Přihlásit se
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <Link href="/" className="text-sm text-slate-400 hover:text-blue-600 transition-colors">
                        ← Zpět na web
                    </Link>
                </div>
            </div>
        </div>
    );
}
