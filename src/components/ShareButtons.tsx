"use client";

import { Share2, Facebook, Twitter, Link as LinkIcon, Check } from "lucide-react";
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

            <Button variant="ghost" size="icon" onClick={() => handleShare('twitter')} className="text-sky-500 hover:bg-sky-50" title="Sdílet na Twitter">
                <Twitter className="h-4 w-4" />
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
