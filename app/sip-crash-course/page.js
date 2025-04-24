'use client'
import React, { useState, useEffect } from 'react'
import { ShieldCheck, Lock, Rocket, Sparkles, BookOpenCheck, PlayCircle, CheckCircle, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabaseClient'
import { initialChapters } from './chapters'
import confetti from 'canvas-confetti'


export default function SIPCrashCourse() {
    const [user, setUser] = useState(null)
    const [chapters, setChapters] = useState(initialChapters.map(ch => ({ ...ch, isExpanded: false })))
    const [progress, setProgress] = useState(0)
    const [activeChapter, setActiveChapter] = useState(null)
    const [showResetModal, setShowResetModal] = useState(false) // 🆕 New state

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
        const fetchProgress = async () => {
            if (!user) return
            const { data } = await supabase
                .from('sip_progress')
                .select('chapter_index')
                .eq('user_id', user.id)
                .eq('completed', true)
            if (data) {
                const updated = initialChapters.map((ch, idx) => ({
                    ...ch,
                    isExpanded: data.some(p => p.chapter_index === idx),
                }))
                setChapters(updated)
                setProgress(Math.round((updated.filter(ch => ch.isExpanded).length / updated.length) * 100))
            }
        }
        fetchProgress()
    }, [user])

    const handleStartLearning = (index) => {
        if (index > 0 && !chapters[index - 1].isExpanded) return
        setActiveChapter(index)
    }

    const handleDone = async () => {
        const updated = [...chapters]
        if (!updated[activeChapter].isExpanded) {
            updated[activeChapter].isExpanded = true
            const viewed = updated.filter(ch => ch.isExpanded).length
            const total = updated.length
            setProgress(Math.round((viewed / total) * 100))

            confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } })

            toast.success(`Chapter "${updated[activeChapter].title}" completed!`, { duration: 2500 })

            if (activeChapter + 1 < total) {
                setTimeout(() => {
                    toast.info(`Chapter ${activeChapter + 2} unlocked!`, { duration: 2000 })
                }, 2000) // 2-second delay
            }
        }

        setChapters(updated)
        setActiveChapter(null)

        if (user) {
            await supabase.from('sip_progress').upsert([
                { user_id: user.id, chapter_index: activeChapter, completed: true }
            ], { onConflict: ['user_id', 'chapter_index'] })
        }
    }


    // 🆕 Open confirmation modal
    const handleResetClick = () => setShowResetModal(true)

    // 🆕 Confirm and perform reset
    const confirmResetProgress = async () => {
        if (!user) return

        setChapters(initialChapters.map(ch => ({ ...ch, isExpanded: false })))
        setProgress(0)
        setActiveChapter(null)
        setShowResetModal(false)

        await supabase
            .from('sip_progress')
            .delete()
            .eq('user_id', user.id)

        toast.success('Progress has been reset.')
    }

    if (!user) {
        return <main className="relative min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0a0f1c] to-[#020617] flex items-center justify-center px-4 overflow-hidden">
            {/* 🔵 Enhanced Background Animation */}
            <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
                <motion.div
                    animate={{ x: [0, 50, -50, 0], y: [0, 30, -30, 0] }}
                    transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
                    className="absolute w-96 h-96 bg-blue-700 opacity-10 rounded-full blur-[100px] top-1/3 left-1/4"
                />
                <motion.div
                    animate={{ x: [0, -40, 40, 0], y: [0, -20, 20, 0] }}
                    transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
                    className="absolute w-80 h-80 bg-cyan-400 opacity-10 rounded-full blur-[80px] bottom-1/4 right-1/4"
                />
                <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}
                    className="absolute inset-0 w-full h-full bg-gradient-radial from-blue-500/10 via-transparent to-transparent"
                />
            </div>

            {/* 🧊 Auth Gate Glass Card */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="z-10 bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-2xl p-8 max-w-md w-full text-center text-white"
            >
                <div className="mb-4 flex justify-center">
                    <ShieldCheck className="w-10 h-10 text-blue-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">Hold up! You need to sign&nbsp;in</h2>
                <p className="text-gray-300 text-sm mb-6">
                    SIP Mastery is exclusive to signed-in users. Please log in to unlock your journey.
                </p>
                <button
                    onClick={() => window.location.href = '/sign-in'} // Update route
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all text-white px-5 py-2 rounded-lg font-semibold shadow-lg hover:shadow-blue-500/40"
                >
                    Sign In Now
                </button>
            </motion.div>
        </main>
    }

    return (
        <main className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-4 py-12 sm:px-6 lg:px-8 overflow-hidden">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">SIP Mastery</h1>
                <p className="text-gray-300 text-center mb-8 text-base sm:text-lg max-w-2xl mx-auto">Whether you&apos;re just getting started or want to invest smarter, this professional guide breaks down SIPs clearly so you can make confident financial decisions.</p>
                <div className="mb-10">
                    <div className="flex justify-between items-center mb-2 text-xs sm:text-sm text-gray-400">
                        <span>Progress: {progress}%</span>
                        <span>{chapters.filter(ch => ch.isExpanded).length} / {chapters.length} Chapters Completed</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} className="h-2 bg-cyan-400 rounded-full"></motion.div>
                    </div>
                </div>

                <div className="space-y-6">
                    {chapters.map((ch, i) => {
                        const isLocked = i > 0 && !chapters[i - 1].isExpanded
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.1 }}
                                className={`bg-[#1f2937] border ${ch.isExpanded ? 'border-blue-500' : 'border-gray-700'} rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between shadow-md transition duration-300`}
                            >
                                <div className="flex items-center mb-2 sm:mb-0 space-x-3">
                                    {ch.icon}
                                    <h2 className="text-base sm:text-lg font-medium flex items-center gap-2">
                                        {ch.title}
                                        {ch.isExpanded && <CheckCircle className="w-5 h-5 text-blue-400" />}
                                    </h2>
                                </div>
                                <button
                                    onClick={() => handleStartLearning(i)}
                                    disabled={isLocked}
                                    className={`text-sm w-fit flex items-center gap-2 transition-all ${isLocked ? 'text-gray-500 cursor-not-allowed' : 'text-blue-400 hover:underline'}`}
                                >
                                    {isLocked ? (
                                        <><Lock className="w-4 h-4" /> Locked</>
                                    ) : ch.isExpanded ? (
                                        <><RotateCcw className="w-4 h-4" /> Revisit</>
                                    ) : (
                                        <><PlayCircle className="w-4 h-4" /> Start Learning</>
                                    )}
                                </button>
                            </motion.div>
                        )
                    })}
                </div>

                <AnimatePresence>
                    {activeChapter !== null && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        >
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 50, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-[#1f2937] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 text-white shadow-2xl"
                            >
                                <h2 className="text-xl sm:text-2xl font-semibold mb-4 flex items-center">
                                    {chapters[activeChapter].icon} {chapters[activeChapter].title}
                                </h2>
                                <p className="whitespace-pre-line text-gray-300 text-base leading-relaxed mb-6">
                                    {chapters[activeChapter].content}
                                </p>
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleDone}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                                    >
                                        Done
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 🆕 Custom Reset Confirmation Modal */}
                <AnimatePresence>
                    {showResetModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white/10 border border-white/20 backdrop-blur-xl p-6 rounded-2xl text-white max-w-md w-full shadow-2xl"
                            >
                                <h3 className="text-lg font-semibold mb-4">Reset Progress?</h3>
                                <p className="text-sm text-gray-300 mb-6">This will erase all your progress and cannot be undone.</p>
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setShowResetModal(false)}
                                        className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmResetProgress}
                                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold"
                                    >
                                        Confirm Reset
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={handleResetClick}
                    className="mt-8 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                >
                    Reset Progress
                </button>
            </div>
        </main>
    )
}






