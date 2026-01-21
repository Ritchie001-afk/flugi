
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Mail, Send, MessageSquare } from "lucide-react";
import { sendContactMessage } from "../actions/contact";

export default function ContactPage() {
    const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormState('submitting');
        setErrorMessage("");

        const formData = new FormData(e.target as HTMLFormElement);

        try {
            const result = await sendContactMessage(formData);

            if (result.success) {
                setFormState('success');
            } else {
                setFormState('error');
                setErrorMessage(result.error || "Odeslání se nezdařilo.");
            }
        } catch (error) {
            setFormState('error');
            setErrorMessage("Chyba připojení.");
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 pt-24 pb-20">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">

                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
                            Jsme tu pro vás
                        </h1>
                        <p className="text-xl text-slate-600">
                            Máte dotaz k nabídce, nápad na zlepšení nebo jen chcete pozdravit? Napište nám.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Contact Info */}
                        <div className="md:col-span-1 space-y-6">
                            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                                <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <Mail className="h-5 w-5 text-blue-600" /> Kontaktní údaje
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Email</p>
                                        <a href="mailto:info@flugi.cz" className="text-lg font-medium text-slate-900 hover:text-blue-600 transition-colors">
                                            info@flugi.cz
                                        </a>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Spolupráce</p>
                                        <a href="mailto:partneri@flugi.cz" className="text-lg font-medium text-slate-900 hover:text-blue-600 transition-colors">
                                            partneri@flugi.cz
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-lg relative overflow-hidden">
                                <div className="relative z-10">
                                    <h3 className="font-bold text-xl mb-4">Často kladené dotazy</h3>
                                    <p className="text-blue-100 mb-6 text-sm">
                                        Než nám napíšete, zkuste se podívat, jestli už jsme na vaši otázku neodpověděli.
                                    </p>
                                    <Button variant="secondary" size="sm" className="w-full">
                                        Přejít na FAQ
                                    </Button>
                                </div>
                                <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/2 -translate-y-1/2">
                                    <MessageSquare className="h-32 w-32" />
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="md:col-span-2">
                            <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-xl">
                                {formState === 'success' ? (
                                    <div className="text-center py-20">
                                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                                            <Send className="h-10 w-10 text-green-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Zpráva odeslána!</h2>
                                        <p className="text-slate-600 mb-8 max-w-md mx-auto">
                                            Děkujeme, že jste nám napsali. Ozveme se vám zpět co nejdříve, obvykle do 24 hodin.
                                        </p>
                                        <Button variant="outline" onClick={() => setFormState('idle')}>
                                            Poslat další zprávu
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label htmlFor="name" className="text-sm font-bold text-slate-900">Jméno</label>
                                                <input
                                                    id="name"
                                                    name="name"
                                                    required
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                                    placeholder="Jan Novák"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="email" className="text-sm font-bold text-slate-900">Email</label>
                                                <input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    required
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                                    placeholder="jan@example.com"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="subject" className="text-sm font-bold text-slate-900">Předmět</label>
                                            <select
                                                id="subject"
                                                name="subject"
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                            >
                                                <option>Obecný dotaz</option>
                                                <option>Problém s rezervací</option>
                                                <option>Spolupráce</option>
                                                <option>Nahlásit chybu</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="message" className="text-sm font-bold text-slate-900">Zpráva</label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                required
                                                rows={5}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
                                                placeholder="Jak vám můžeme pomoci?"
                                            />
                                        </div>

                                        {formState === 'error' && (
                                            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center text-sm">
                                                {errorMessage}
                                            </div>
                                        )}

                                        <Button
                                            type="submit"
                                            className="w-full py-6 text-lg"
                                            variant="premium"
                                            disabled={formState === 'submitting'}
                                        >
                                            {formState === 'submitting' ? 'Odesílání...' : 'Odeslat zprávu'}
                                        </Button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
