
import Link from "next/link";
import { Plane, Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-border/40 bg-slate-50 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <Plane className="h-6 w-6 text-blue-600" />
                            <span className="text-xl font-display font-bold text-blue-900">
                                Flugi
                            </span>
                        </Link>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Prémiové letenky a dovolené na míru pro moderní cestovatele.
                            Objevte své další dobrodružství s Flugi.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="space-y-4">
                        <h3 className="font-display font-bold text-slate-900">Prozkoumat</h3>
                        <ul className="space-y-2">
                            <li><Link href="/deals" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Levné letenky</Link></li>
                            <li><Link href="/hotels" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Luxusní hotely</Link></li>
                            <li><Link href="/pruvodce" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Průvodce letišti</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-display font-bold text-slate-900">Společnost</h3>
                        <ul className="space-y-2">
                            <li><Link href="/about" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">O nás</Link></li>
                            <li><Link href="/contact" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Kontakt</Link></li>
                            <li><Link href="/privacy" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Ochrana soukromí</Link></li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div className="space-y-4">
                        <h3 className="font-display font-bold text-slate-900">Sledujte nás</h3>
                        <div className="flex gap-4">
                            <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-white border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group">
                                <Facebook className="h-4 w-4 text-slate-400 group-hover:text-blue-500" />
                            </a>
                            <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-white border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group">
                                <Twitter className="h-4 w-4 text-slate-400 group-hover:text-blue-500" />
                            </a>
                            <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-white border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group">
                                <Instagram className="h-4 w-4 text-slate-400 group-hover:text-blue-500" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
                    &copy; {new Date().getFullYear()} Flugi. Všechna práva vyhrazena.
                </div>
            </div>
        </footer>
    );
}
