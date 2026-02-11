import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Script from "next/script";
import CookieConsent from "@/components/CookieConsent";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://www.flugi.cz"),
  title: "Flugi - Exkluzivní letenky a dovolená",
  description: "Najděte ty nejlepší letenky a pobyty s prémiovým zážitkem.",
  openGraph: {
    siteName: "Flugi.cz",
    type: "website",
    locale: "cs_CZ",
  },
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
          outfit.variable
        )}
      >
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </div>
        <GoogleAnalytics />
        <CookieConsent />
      </body>
    </html>
  );
}
