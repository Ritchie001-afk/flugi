'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

const GA_MEASUREMENT_ID = 'G-8W2VM3MVQK';

export default function GoogleAnalytics() {
    const [consentGranted, setConsentGranted] = useState(false);

    useEffect(() => {
        // Check initial status
        const consent = localStorage.getItem('cookie_consent');
        if (consent === 'granted') {
            setConsentGranted(true);
        }

        // Listen for updates from the banner
        const handleConsentUpdate = () => {
            if (localStorage.getItem('cookie_consent') === 'granted') {
                setConsentGranted(true);
            }
        };

        window.addEventListener('cookie_consent_updated', handleConsentUpdate);

        return () => {
            window.removeEventListener('cookie_consent_updated', handleConsentUpdate);
        };
    }, []);

    if (!consentGranted) return null;

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
            </Script>
        </>
    );
}
