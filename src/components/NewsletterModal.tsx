
"use client";

import { useState } from "react";
import { X, Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { subscribeToNewsletter } from "../../app/actions/subscribe";

interface NewsletterModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus("loading");
        setErrorMessage("");

        try {
            const formData = new FormData();
            formData.append("email", email);

            const result = await subscribeToNewsletter(formData);

            if (result.success) {
                setStatus("success");
                setTimeout(() => {
                    onClose();
                    setStatus("idle");
                    setEmail("");
                }, 3000);
            } else {
                setStatus("error");
                setErrorMessage(result.error || "Něco se pokazilo.");
            }
        } catch (error) {
            setStatus("error");
            setErrorMessage("Chyba připojení. Zkuste to prosím znovu.");
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full relative shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="text-center mb-6">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${status === "success" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}`}>
                        {status === "success" ? <Check className="h-6 w-6" /> : <Mail className="h-6 w-6" />}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        {status === "success" ? "Jste přihlášeni!" : "Hlídat akční letenky"}
                    </h2>
                    <p className="text-slate-600">
                        {status === "success"
                            ? "Děkujeme. Ty nejlepší nabídky vám pošleme přímo do schránky."
                            : "Nenechte si utéct chybné tarify a akční nabídky. Pošleme vám je emailem hned, jak se objeví."}
                    </p>
                </div>

                {status !== "success" ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="email"
                                required
                                placeholder="Váš email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>

                        {status === "error" && (
                            <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
                                {errorMessage}
                            </p>
                        )}

                        <Button
                            variant="premium"
                            className="w-full py-6 text-lg"
                            disabled={status === "loading"}
                        >
                            {status === "loading" ? "Přihlašování..." : "Chci hlídat letenky"}
                        </Button>
                        <p className="text-xs text-center text-slate-400">
                            Žádný spam. Odhlásit se můžete kdykoliv.
                        </p>
                    </form>
                ) : (
                    <div className="text-center">
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={onClose}
                        >
                            Zavřít
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
