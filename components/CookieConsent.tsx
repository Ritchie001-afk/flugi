'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (consent === null) {
            setShowBanner(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('cookie_consent', 'granted');
        setShowBanner(false);
        window.dispatchEvent(new Event('cookie_consent_updated'));
    };

    const declineCookies = () => {
        localStorage.setItem('cookie_consent', 'denied');
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 backdrop-blur-sm border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] transition-all transform animate-in slide-in-from-bottom duration-500">
            <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-slate-600 text-center sm:text-left">
                    <p>
                        Používáme cookies k analýze návštěvnosti a vylepšení vašeho zážitku.
                        Kliknutím na „Přijmout“ souhlasíte s ukládáním cookies.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={declineCookies}
                        size="sm"
                        className="whitespace-nowrap"
                    >
                        Odmítnout
                    </Button>
                    <Button
                        onClick={acceptCookies}
                        size="sm"
                        className="whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Přijmout vše
                    </Button>
                </div>
            </div>
        </div>
    );
}
