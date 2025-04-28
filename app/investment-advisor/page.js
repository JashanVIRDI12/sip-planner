"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "/lib/supabaseClient";
import { toast } from "sonner"; // ✅ Toast library
import "/app/globals.css";

export default function InvestmentAdvisor() {
    const [query, setQuery] = useState('');
    const [responseList, setResponseList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const chatContainerRef = useRef(null); // ✅ for scrolling inside chat div

    useEffect(() => {
        async function getUser() {
            const { data } = await supabase.auth.getSession();
            if (data?.session?.user) {
                setUser(data.session.user);
            }
        }
        getUser();
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [responseList, loading]);

    const handleAsk = async (promptText) => {
        const question = promptText || query;
        if (!question.trim()) return;

        setResponseList(prev => [...prev, { type: 'user', text: question }]);
        setLoading(true);
        setQuery('');

        const res = await fetch('/api/ai-suggest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'system',
                        content: `
              You are an experienced SIP investment advisor in India.
              You explain things simply and naturally like talking to a friend.
              Mention mutual fund examples if needed.
              Keep answers around 200-300 words.
              End each answer with a helpful question.
            `
                    },
                    { role: 'user', content: question }
                ]
            })
        });

        const data = await res.json();
        setResponseList(prev => [...prev, { type: 'bot', text: data.result || 'Sorry, something went wrong.' }]);
        setLoading(false);
        toast.success("Got an answer for you! 🎯"); // ✅ Toast on reply
    };

    const suggestions = [
        'Best SIP for ₹10000/month for 5 years',
        'Safe investment for ₹5000 for 3 years',
        'How to plan for house buying in 10 years',
        'Child education plan with ₹15000/month'
    ];

    const BackgroundAnimation = () => (
        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
            <motion.div
                animate={{ x: [0, 50, -50, 0], y: [0, 30, -30, 0] }}
                transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
                className="absolute w-96 h-96 bg-blue-700 opacity-10 rounded-full blur-[100px] top-1/3 left-1/4"
            />
            <motion.div
                animate={{ x: [0, -40, 40, 0], y: [0, -20, 20, 0] }}
                transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
                className="absolute w-80 h-80 bg-cyan-400 opacity-10 rounded-full blur-[80px] bottom-1/4 right-1/4"
            />
            <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
                className="absolute inset-0 w-full h-full bg-gradient-radial from-blue-500/10 via-transparent to-transparent"
            />
        </div>
    );

    if (!user) {
        return (
            <main className="relative min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0a0f1c] to-[#020617] flex items-center justify-center px-4 overflow-hidden">
                <BackgroundAnimation />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-md w-full text-center text-white"
                >
                    <ShieldCheck className="w-10 h-10 mx-auto text-blue-400 mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">Sign in required</h2>
                    <p className="text-gray-300 text-sm mb-6">
                        Please sign in to use the SIP Advisor.
                    </p>
                    <button
                        onClick={() => window.location.href = '/sign-in'}
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-5 py-2 rounded-lg font-semibold shadow-lg"
                    >
                        Sign In
                    </button>
                </motion.div>
            </main>
        )
    }

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-[#0f172a] to-[#0b1120] text-white flex items-center justify-center px-2 sm:px-4 py-6 overflow-hidden">
            <BackgroundAnimation />
            <div className="w-full max-w-3xl rounded-3xl p-4 sm:p-6 bg-white/5 backdrop-blur-md border border-white/10 shadow-xl flex flex-col z-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-6">
                    AI SIP Investment Advisor
                </h2>

                <div ref={chatContainerRef} className="flex-1 max-h-[450px] overflow-y-auto space-y-4">
                    {responseList.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className={`max-w-[90%] px-4 py-3 rounded-xl text-sm leading-relaxed ${
                                item.type === 'user'
                                    ? 'ml-auto bg-gradient-to-br from-blue-600 to-blue-500 text-white'
                                    : 'bg-[#1e293b]/70 text-slate-100 border border-white/10'
                            }`}
                        >
                            {item.text}
                        </motion.div>
                    ))}
                    {loading && (
                        <div className="animate-pulse bg-white/10 px-4 py-3 rounded-xl text-sm text-gray-400 border border-white/10 w-fit">
                            Typing...
                        </div>
                    )}
                </div>

                <div className="mt-4 relative">
                    <input
                        type="text"
                        placeholder="Ask about SIP investments..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !loading) {
                                e.preventDefault();
                                handleAsk();
                            }
                        }}
                        className="w-full bg-[#1e293b]/80 border border-white/10 rounded-full px-5 py-3 pr-12 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                    <button
                        onClick={() => handleAsk()}
                        disabled={loading}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-cyan-400 hover:text-cyan-300 disabled:opacity-50"
                    >
                        <ArrowUpRight className="w-5 h-5" />
                    </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    {suggestions.map((text, i) => (
                        <button
                            key={i}
                            onClick={() => handleAsk(text)}
                            disabled={loading}
                            className="text-xs sm:text-sm px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition"
                        >
                            {text}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}






