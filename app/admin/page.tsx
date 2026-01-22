import { logout } from './auth-actions';
import { LogOut } from 'lucide-react';

export default function AdminPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
                <h1 className="text-2xl font-bold text-blue-900 mb-4">Administrace (Rebuild Mode)</h1>
                <p className="text-slate-600 mb-6">Testování základní funkčnosti...</p>
                <form action={logout}>
                    <button className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 mx-auto">
                        <LogOut className="h-4 w-4" /> Odhlásit se
                    </button>
                </form>
            </div>
        </div>
    );
}
