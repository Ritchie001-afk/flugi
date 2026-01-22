'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Plane } from 'lucide-react';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="mb-8 flex items-center gap-2">
                <div className="p-3 bg-blue-600 rounded-xl">
                    <Plane className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-display font-bold text-blue-900">Flugi Admin</h1>
            </div>

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">Přihlášení (Disabled)</h2>

                <div className="p-4 bg-yellow-100 text-yellow-800 rounded mb-4 text-center">
                    Autentizace dočasně vypnuta pro debugging.
                </div>

                <Link href="/admin">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg shadow-lg shadow-blue-900/10">
                        Vstoupit do administrace
                    </Button>
                </Link>
            </div>
        </div>
    );
}
