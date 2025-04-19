'use client'
import Link from 'next/link'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import ParticleBackground from '@/components/ParticleBackground'

export default function HomeHero() {
    useEffect(() => {
        document.documentElement.classList.add('dark')
    }, [])

    return (
        <main className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-white relative overflow-hidden">
            <ParticleBackground />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-800/20 via-transparent to-black z-0" />

            <div className="relative z-10 max-w-4xl mx-auto px-4 py-24 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="backdrop-blur-xl border border-blue-700/30 bg-white/5 rounded-2xl p-10 shadow-lg w-full max-w-3xl ring-1 ring-blue-800/20"
                >
                    <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                        Smarter Investing <br /> Starts Here.
                    </h1>

                    <p className="mt-6 text-lg md:text-xl text-gray-200 font-light">
                        Calculate SIP returns, set investment goals, and find the right mutual fund allocations based on your risk appetite.
                    </p>

                    <p className="mt-3 text-md text-cyan-400 font-medium">
                        Taking the Risk Profile Quiz is highly recommended for tailored recommendations.
                    </p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-8"
                    >
                        <Link href="/risk-profile">
                            <button className="px-6 py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition shadow-lg hover:shadow-2xl">
                                Get Started
                            </button>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </main>
    )
}





