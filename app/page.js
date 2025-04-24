'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChartBarIcon, ArrowTrendingUpIcon, CursorArrowRaysIcon } from '@heroicons/react/24/outline'
import ParticleBackground from '../components/ParticleBackground'

import Image from 'next/image'
import Tilt from 'react-parallax-tilt'

const features = [
    {
        title: 'Projected Returns',
        description: 'Visualize your investment growth over time.',
        icon: <ArrowTrendingUpIcon className="h-8 w-8 text-cyan-400" />,
    },
    {
        title: 'Asset Allocation',
        description: 'Smart splits based on your risk profile.',
        icon: <ChartBarIcon className="h-8 w-8 text-cyan-400" />,
    },
    {
        title: 'Goal Tracking',
        description: 'Set financial goals and watch your progress.',
        icon: <CursorArrowRaysIcon className="h-8 w-8 text-cyan-400" />,
    },
]

export default function HomePage() {
    useEffect(() => {
        document.documentElement.classList.add('dark')
    }, [])

    return (
        <main className="min-h-screen bg-gradient-to-br from-[#02040a] via-[#010207] to-black text-white relative overflow-hidden">
        <ParticleBackground />
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-800/10 via-blue-900/5 to-transparent pointer-events-none" />
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-28 md:space-y-36">
                <HeroSection />
                <FeaturesSection />
                <CTASection />
            </div>
        </main>
    )
}

function HeroSection() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
            >
                <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 text-transparent bg-clip-text animate-shimmer">
                    Take Control of Your Financial Future
                </h1>
                <p className="text-base sm:text-lg text-gray-300">
                    Build smarter portfolios, calculate SIP returns, and align your investments with your goals — no guesswork, just clarity.
                </p>
                <p className="text-sm sm:text-md text-cyan-400 font-medium">
                    Start with a SIP Calculator or take the Risk Profile Quiz to get personalized insights.
                </p>
                <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-4">
                    <Link href="/sip-calculator">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-600 font-semibold transition w-full sm:w-auto"
                        >
                            Try SIP Calculator
                        </motion.button>
                    </Link>
                    <Link href="/risk-profile">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="px-6 py-3 rounded-lg border border-cyan-400 text-cyan-300 hover:bg-cyan-500/10 transition w-full sm:w-auto"
                        >
                            Take Risk Profile Quiz
                        </motion.button>
                    </Link>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex justify-center mt-10 lg:mt-0"
            >
                <Tilt glareEnable={true} glareMaxOpacity={0.1} scale={1.02} transitionSpeed={1500} tiltMaxAngleX={8} tiltMaxAngleY={8}>
                    <Image
                        src="/dashboard.png"
                        alt="Dashboard Illustration"
                        width={500}
                        height={300}
                        className="rounded-xl border border-white/10 shadow-md w-full max-w-md"
                    />
                </Tilt>
            </motion.div>
        </div>
    )
}

function FeaturesSection() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
                <Tilt key={index} glareEnable={true} glareMaxOpacity={0.05} scale={1.03} transitionSpeed={1200} tiltMaxAngleX={6} tiltMaxAngleY={6}>
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.2 }}
                        className="rounded-xl p-6 bg-white/5 backdrop-blur-md shadow-lg ring-1 ring-white/10 border border-white/10 hover:shadow-cyan-500/20 transition duration-300"
                    >
                        <div className="mb-4">{feature.icon}</div>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{feature.title}</h3>
                        <p className="text-sm text-gray-300">{feature.description}</p>
                    </motion.div>
                </Tilt>
            ))}
        </div>
    )
}

function CTASection() {
    return (
        <div className="relative py-16 px-4 sm:px-6 mt-20">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="relative z-10 max-w-4xl mx-auto backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-10 text-center shadow-[0_0_30px_rgba(0,255,255,0.1)] overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-600/5 to-transparent rounded-3xl pointer-events-none" />
                <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-[length:300%_300%] animate-gradient-x">
                Ready to Take Control of Your Finances?
                </h2>
                <p className="text-gray-300 mt-4 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                    Whether you&apos;re just starting or optimizing your portfolio, our tools are built
                    to make your investment journey smarter and smoother.
                </p>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8"
                >
                    <Link href="/risk-profile">
                        <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-300 rounded-xl font-semibold text-white transition shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40">
                            Take the Quiz
                        </button>
                    </Link>
                </motion.div>
            </motion.div>

            {/* Subtle animated glow background */}
            <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
                <div className="w-[500px] h-[500px] bg-cyan-400/10 rounded-full blur-3xl animate-pulse-slow" />
            </div>
        </div>
    );
}









