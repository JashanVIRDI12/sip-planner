'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowUpRight, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '/lib/supabaseClient'
import '/app/globals.css'

export default function InvestmentAdvisor() {
    const [query, setQuery] = useState('')
    const [responseList, setResponseList] = useState([])
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(null)
    const chatEndRef = useRef(null)

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.user) {
                setUser(session.user)
            }
        }
        getUser()
    }, [])

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [responseList, loading])

    const handleAsk = async (prompt) => {
        const q = prompt || query
        if (!q.trim()) return

        setResponseList((prev) => [...prev, { type: 'user', text: q }])
        setLoading(true)
        setQuery('')

        const res = await fetch('/api/ai-suggest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'system',
                        content:
                            'You are India’s number one SIP investment advisor...dont use dividers , special characters'
                    },
                    { role: 'user', content: q }
                ]
            })
        })

        const data = await res.json()
        setResponseList((prev) => [...prev, { type: 'bot', text: data.result || 'Something went wrong.' }])
        setLoading(false)
    }

    const suggestions = [
        'Best SIP for ₹10000/month for 5 years',
        'How to invest ₹5000 for 3 years low risk',
        'SIP plan for buying a house in 10 years',
        '₹15000/month investment for child education'
    ]

    const BackgroundAnimation = () => (
        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
            <motion.div
                animate={{ x: [0, 50, -50, 0], y: [0, 30, -30, 0] }}
                transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
                className="absolute w-96 h-96 bg-blue-700 opacity-10 rounded-full blur-[100px] top-1/3 left-1/4"
            />
            <motion.div
                animate={{ x: [0, -40, 40, 0], y: [0, -20, 20, 0] }}
                transition={{ repeat: Infinity, duration: 14, ease: 'easeInOut' }}
                className="absolute w-80 h-80 bg-cyan-400 opacity-10 rounded-full blur-[80px] bottom-1/4 right-1/4"
            />
            <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}
                className="absolute inset-0 w-full h-full bg-gradient-radial from-blue-500/10 via-transparent to-transparent"
            />
        </div>
    )

    if (!user) {
        return (
            <main className="relative min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0a0f1c] to-[#020617] flex items-center justify-center px-4 overflow-hidden">
                <BackgroundAnimation />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="z-10 bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-2xl p-8 max-w-md w-full text-center text-white"
                >
                    <div className="mb-4 flex justify-center">
                        <ShieldCheck className="w-10 h-10 text-blue-400" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-semibold mb-2">Sign in required</h2>
                    <p className="text-gray-300 text-sm mb-6">
                        Please sign in to access the SIP investment advisor.
                    </p>
                    <button
                        onClick={() => window.location.href = '/sign-in'}
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all text-white px-5 py-2 rounded-lg font-semibold shadow-lg"
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
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4 sm:mb-6">
                    AI SIP Investment Advisor
                </h2>

                <div className="flex-1 max-h-[400px] sm:max-h-[500px] space-y-4 px-2 scroll-container overflow-y-auto">
                    {responseList.map((item, i) => (
                        <div
                            key={i}
                            className={`max-w-[90%] px-4 py-3 rounded-xl whitespace-pre-wrap text-sm leading-relaxed ${
                                item.type === 'user'
                                    ? 'bg-gradient-to-br from-blue-600 to-blue-500 self-end ml-auto text-white'
                                    : 'bg-white/10 border border-white/10 text-gray-200 backdrop-blur-sm'
                            }`}
                        >
                            {item.text}
                        </div>
                    ))}
                    {loading && (
                        <div className="bg-white/10 px-4 py-3 rounded-xl text-sm text-gray-400 border border-white/10 animate-pulse w-fit">
                            Thinking...
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                <div className="mt-4 sm:mt-6 relative w-full">
                    <input
                        type="text"
                        placeholder="Example: I am moderate risk and want to invest 10000 per month for 5 years"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !loading && handleAsk()}
                        className="w-full bg-white/10 border border-white/10 rounded-full px-5 py-3 pr-12 text-sm text-white placeholder:text-gray-400 backdrop-blur focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={() => handleAsk()}
                        disabled={loading}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-cyan-400 hover:text-cyan-300 disabled:opacity-50"
                    >
                        <ArrowUpRight className="w-5 h-5" />
                    </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
                    {suggestions.map((text, i) => (
                        <button
                            key={i}
                            onClick={() => handleAsk(text)}
                            disabled={loading}
                            className="text-xs sm:text-sm px-4 py-2 bg-white/5 text-gray-300 hover:bg-white/10 rounded-full border border-white/10 transition-all"
                        >
                            {text}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

