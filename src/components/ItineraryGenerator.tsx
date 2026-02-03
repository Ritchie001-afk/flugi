
"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "./ui/Button";
import { Sparkles, Calendar, Loader2 } from "lucide-react";

interface ItineraryGeneratorProps {
    destination: string;
    length?: number;
}

export function ItineraryGenerator({ destination, length = 7 }: ItineraryGeneratorProps) {
    const [days, setDays] = useState(length);
    const [loading, setLoading] = useState(false);
    const [itinerary, setItinerary] = useState<string | null>(null);

    const generateItinerary = async () => {
        setLoading(true);
        setItinerary(null);

        try {
            const response = await fetch("/api/itinerary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ destination, days }),
            });

            const data = await response.json();
            if (data.itinerary) {
                setItinerary(data.itinerary);
            } else {
                setItinerary("Omlouváme se, itinerář se nepodařilo vygenerovat. Zkuste to prosím později.");
            }
        } catch (error) {
            setItinerary("Došlo k chybě při komunikaci s AI.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 shadow-sm border border-indigo-100">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold font-display text-indigo-900 flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-purple-600" />
                    AI Plánovač Cesty
                </h2>
                <span className="px-3 py-1 bg-white/80 backdrop-blur text-indigo-700 text-xs font-bold rounded-full border border-indigo-200 shadow-sm">
                    Powered by Gemini
                </span>
            </div>

            {!itinerary && (
                <div className="space-y-6">
                    <p className="text-slate-600">
                        Nechte umělou inteligenci, aby vám sestavila dokonalý plán pro <strong>{destination}</strong> na míru.
                    </p>

                    <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                        <label className="block text-sm font-medium text-slate-700 mb-2 flex justify-between">
                            <span>Délka pobytu</span>
                            <span className="text-indigo-600 font-bold">{days} dní</span>
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="14"
                            value={days}
                            onChange={(e) => setDays(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <div className="flex justify-between text-xs text-slate-400 mt-2">
                            <span>1 den</span>
                            <span>14 dní</span>
                        </div>
                    </div>

                    <Button
                        onClick={generateItinerary}
                        disabled={loading}
                        className="w-full h-12 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/20 text-white"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Přemýšlím...
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-5 w-5 mr-2" /> Vygenerovat itinerář
                            </>
                        )}
                    </Button>
                </div>
            )}

            {loading && !itinerary && (
                <div className="py-12 text-center text-slate-500 space-y-4 animate-pulse">
                    <div className="h-4 bg-indigo-200 rounded w-3/4 mx-auto"></div>
                    <div className="h-4 bg-indigo-200 rounded w-1/2 mx-auto"></div>
                    <div className="h-4 bg-indigo-200 rounded w-2/3 mx-auto"></div>
                    <p className="text-sm">Analyzuji mapy, recenze a tajné tipy...</p>
                </div>
            )}

            {itinerary && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="prose prose-indigo max-w-none bg-white p-6 rounded-xl border border-indigo-100 shadow-sm">
                        <ReactMarkdown
                            components={{
                                h1: ({ node, ...props }) => <h1 className="font-display font-bold text-xl mb-4" {...props} />,
                                h2: ({ node, ...props }) => <h2 className="font-display font-bold text-lg mb-3 mt-6 text-indigo-800" {...props} />,
                                h3: ({ node, ...props }) => <h3 className="font-display font-bold text-md mb-2 mt-4" {...props} />,
                                strong: ({ node, ...props }) => <strong className="font-bold text-indigo-900" {...props} />
                            }}
                        >
                            {itinerary}
                        </ReactMarkdown>
                    </div>
                    <div className="mt-6 text-center">
                        <Button variant="outline" onClick={() => setItinerary(null)} className="text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                            Sestavit jiný plán
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
