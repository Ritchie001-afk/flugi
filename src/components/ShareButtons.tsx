"use client";

import { Share2, Facebook, Link as LinkIcon, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/Button";

interface ShareButtonsProps {
    title: string;
}

export function ShareButtons({ title }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = (platform: 'facebook' | 'twitter' | 'whatsapp') => {
        const url = window.location.href;
        const text = `Sleduj tuhle pecku na Flugi: ${title}`;

        let shareUrl = '';
        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
                break;
        }
        window.open(shareUrl, '_blank', 'width=600,height=400');
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-500 hidden sm:inline">Sdílet:</span>

            <Button variant="ghost" size="icon" onClick={() => handleShare('facebook')} className="text-blue-600 hover:bg-blue-50" title="Sdílet na Facebook">
                <Facebook className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="icon" onClick={() => handleShare('twitter')} className="text-slate-900 hover:bg-slate-50" title="Sdílet na X">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                </svg>
            </Button>

            <Button variant="ghost" size="icon" onClick={() => handleShare('whatsapp')} className="text-green-500 hover:bg-green-50" title="Sdílet na WhatsApp">
                <Share2 className="h-4 w-4" />
            </Button>

            <div className="w-px h-4 bg-slate-200 mx-1"></div>

            <Button variant="ghost" size="icon" onClick={handleCopy} className={copied ? "text-green-600 bg-green-50" : "text-slate-400 hover:text-slate-600"} title="Zkopírovat odkaz">
                {copied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
            </Button>
        </div>
    );
}
