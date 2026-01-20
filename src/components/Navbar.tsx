
"use client";

import Link from "next/link";
import { Plane, Search, Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { NewsletterModal } from "./NewsletterModal";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
    const router = useRouter();
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
            setSearchQuery("");
        }
    };

    return (
        <>
            <nav className="fixed top-0 w-full z-50 border-b border-border/40 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
                    {/* Logo & Desktop Nav */}
                    <div className="flex items-center gap-8 md:gap-12">
                        <Link href="/" className="flex items-center gap-2 group shrink-0">
                            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                <Plane className="h-6 w-6 text-blue-600 transform -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                            </div>
                            <span className="text-xl font-display font-bold text-blue-900 hidden sm:inline">
                                Flugi
                            </span>
                        </Link>

                        <div className="hidden md:flex items-center gap-8">
                            <Link href="/deals?type=flight" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                                Letenky
                            </Link>
                            <Link href="/deals?type=package" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                                Zájezdy
                            </Link>
                            <Link href="/pruvodce" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                                Průvodce
                            </Link>
                            <Link href="/magazin" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                                Magazín
                            </Link>
                        </div>
                    </div>

                    {/* Actions & Search */}
                    <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">
                        {/* Search Bar - Expandable */}
                        <form onSubmit={handleSearch} className={`relative flex items-center transition-all duration-300 ${isSearchOpen ? "w-full md:w-64" : "w-10"}`}>
                            {isSearchOpen && (
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Hledat..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onBlur={() => !searchQuery && setIsSearchOpen(false)}
                                    className="w-full pl-4 pr-10 py-2 rounded-full border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                                />
                            )}
                            <Button
                                type={isSearchOpen ? "submit" : "button"}
                                variant="ghost"
                                size="icon"
                                className={`text-slate-600 hover:text-blue-600 ${isSearchOpen ? "absolute right-0" : ""}`}
                                onClick={(e) => {
                                    if (!isSearchOpen) {
                                        e.preventDefault();
                                        setIsSearchOpen(true);
                                    }
                                }}
                            >
                                <Search className="h-5 w-5" />
                            </Button>
                        </form>

                        <Button
                            variant="premium"
                            size="sm"
                            className="hidden md:flex whitespace-nowrap"
                            onClick={() => setIsNewsletterOpen(true)}
                        >
                            Hlídat letenky
                        </Button>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden p-2 text-slate-600 hover:text-blue-600 ml-2"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Nav */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-border/40 bg-white absolute w-full left-0 top-16 p-4 flex flex-col gap-4 shadow-xl h-[calc(100vh-64px)] overflow-y-auto">
                        <Link href="/deals?type=flight" className="text-lg font-medium text-slate-600 hover:text-blue-600 p-2" onClick={() => setIsMenuOpen(false)}>
                            Letenky
                        </Link>
                        <Link href="/deals?type=package" className="text-lg font-medium text-slate-600 hover:text-blue-600 p-2" onClick={() => setIsMenuOpen(false)}>
                            Zájezdy
                        </Link>
                        <Link href="/pruvodce" className="text-lg font-medium text-slate-600 hover:text-blue-600 p-2" onClick={() => setIsMenuOpen(false)}>
                            Průvodce
                        </Link>
                        <Link href="/magazin" className="text-lg font-medium text-slate-600 hover:text-blue-600 p-2" onClick={() => setIsMenuOpen(false)}>
                            Magazín
                        </Link>
                        <Button
                            variant="premium"
                            className="w-full mt-4"
                            onClick={() => {
                                setIsMenuOpen(false);
                                setIsNewsletterOpen(true);
                            }}
                        >
                            Hlídat letenky
                        </Button>
                    </div>
                )}
            </nav>

            <NewsletterModal isOpen={isNewsletterOpen} onClose={() => setIsNewsletterOpen(false)} />
        </>
    );
}
