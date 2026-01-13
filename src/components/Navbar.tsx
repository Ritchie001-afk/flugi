
"use client";

import Link from "next/link";
import { Plane, Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-border/40 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                        <Plane className="h-6 w-6 text-blue-600 transform -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                    </div>
                    <span className="text-xl font-display font-bold text-blue-900">
                        Flugi
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/deals" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                        Akční letenky
                    </Link>
                    <Link href="/zajezdy" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                        Zájezdy
                    </Link>
                    <Link href="/pruvodce" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                        Průvodce
                    </Link>
                    <Link href="/blog" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                        Magazín
                    </Link>
                </div>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="text-slate-600 hover:text-blue-600">
                        <Search className="h-5 w-5" />
                    </Button>
                    <Button variant="premium" size="sm">
                        Hlídat letenky
                    </Button>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-slate-600 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Nav */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-border/40 bg-white absolute w-full left-0 top-16 p-4 flex flex-col gap-4 shadow-xl">
                    <Link href="/deals" className="text-lg font-medium text-slate-600 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
                        Akční letenky
                    </Link>
                    <Link href="/pruvodce" className="text-lg font-medium text-slate-600 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
                        Průvodce
                    </Link>
                    <Link href="/blog" className="text-lg font-medium text-slate-600 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
                        Magazín
                    </Link>
                    <Button variant="premium" className="w-full">Hlídat letenky</Button>
                </div>
            )}
        </nav>
    );
}
