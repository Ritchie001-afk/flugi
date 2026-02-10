
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center p-4">
            <h2 className="text-4xl font-bold text-slate-900">404 - Stránka nenalezena</h2>
            <p className="text-slate-600 max-w-md">
                Omlouváme se, ale stránka, kterou hledáte, neexistuje nebo byla přesunuta.
            </p>
            <Link href="/">
                <Button>Zpět na úvodní stránku</Button>
            </Link>
        </div>
    )
}
