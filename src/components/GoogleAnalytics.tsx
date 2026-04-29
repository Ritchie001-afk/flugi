'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { GA_MEASUREMENT_ID } from '@/lib/analytics';

export default function GoogleAnalytics() {
    const [consentGranted, setConsentGranted] = useState(
        () =>
            typeof window !== 'undefined' &&
            localStorage.getItem('cookie_consent') === 'granted'
    );

    useEffect(() => {
        // Listen for updates from the banner
        const handleConsentUpdate = () => {
            setConsentGranted(localStorage.getItem('cookie_consent') === 'granted');
        };

        window.addEventListener('cookie_consent_updated', handleConsentUpdate);

        return () => {
            window.removeEventListener('cookie_consent_updated', handleConsentUpdate);
        };
    }, []);

    if (!consentGranted || !GA_MEASUREMENT_ID) return null;

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
            </Script>
        </>
    );
}
