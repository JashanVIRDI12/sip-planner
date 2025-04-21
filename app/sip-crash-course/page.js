'use client'
import React, { useState } from 'react'
import { Sparkles, Info, PlayCircle, BookOpenCheck, Rocket } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { initialChapters } from './chapters'

export default function SIPCrashCourse() {
    const [chapters, setChapters] = useState(initialChapters.map(ch => ({ ...ch, isExpanded: false })))
    const [progress, setProgress] = useState(0)
    const [activeChapter, setActiveChapter] = useState(null)

    const handleStartLearning = (index) => {
        setActiveChapter(index)
    }

    const handleDone = () => {
        const updated = [...chapters]
        if (!updated[activeChapter].isExpanded) {
            updated[activeChapter].isExpanded = true
            const viewed = updated.filter(ch => ch.isExpanded).length
            const total = updated.length
            const newProgress = Math.round((viewed / total) * 100)
            setProgress(newProgress)
        }
        setChapters(updated)
        setActiveChapter(null)
    }

    return (
        <main className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-4 py-12 overflow-hidden">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-5xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-gradient-x">
                    SIP Mastery
                </h1>
                <p className="text-gray-300 text-center mb-8 text-lg max-w-2xl mx-auto">
                    {"Whether you're just getting started or want to invest smarter, this professional guide breaks down SIPs clearly so you can make confident financial decisions."}
                </p>

                {/* Progress Tracker */}
                <div className="mb-10">
                    <div className="flex justify-between items-center mb-2 text-sm text-gray-400">
                        <span>Progress: {progress}%</span>
                        <span>{chapters.filter(ch => ch.isExpanded).length} / {chapters.length} Chapters Completed</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                            className="h-2 bg-cyan-400 rounded-full"
                        ></motion.div>
                    </div>
                </div>

                <div className="space-y-6">
                    {chapters.map((ch, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.1 }}
                            className="bg-[#1f2937] border border-gray-700 rounded-2xl p-4 shadow-md flex items-center justify-between hover:shadow-purple-500/10 transition duration-300"
                        >
                            <div className="flex items-center space-x-3">
                                {ch.icon}
                                <h2 className="text-lg font-medium text-white">{ch.title}</h2>
                            </div>
                            <button
                                onClick={() => handleStartLearning(i)}
                                className="text-sm text-cyan-400 hover:underline"
                            >
                                {ch.isExpanded ? '✓ Done' : 'Start Learning'}
                            </button>
                        </motion.div>
                    ))}
                </div>

                <AnimatePresence>
                    {activeChapter !== null && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center"
                        >
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 50, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-[#1f2937] rounded-xl max-w-2xl w-full mx-4 p-6 text-white shadow-2xl"
                            >
                                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                                    {chapters[activeChapter].icon} {chapters[activeChapter].title}
                                </h2>
                                <p className="whitespace-pre-line text-gray-300 text-base leading-relaxed mb-6">
                                    {chapters[activeChapter].content}
                                </p>
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleDone}
                                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium"
                                    >
                                        Done
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    )
}
