'use client'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {toast} from "sonner";


const questions = [
    {
        question: 'What is your age group?',
        options: [
            { text: 'Under 25', score: 1 },
            { text: '25-35', score: 2 },
            { text: '36-50', score: 3 },
            { text: 'Above 50', score: 2 },
        ],
    },
    {
        question: 'How stable is your income currently?',
        options: [
            { text: 'Very unstable or no income', score: 1 },
            { text: 'Somewhat stable', score: 2 },
            { text: 'Stable with emergency savings', score: 3 },
            { text: 'Very stable and predictable', score: 4 },
        ],
    },
    {
        question: 'What are you primarily investing for?',
        options: [
            { text: "Long-term wealth creation (15+ years)", score: 4 },
            { text: "Buying a house or child's education", score: 3 },
            { text: 'Emergency fund or short-term goal', score: 2 },
            { text: 'Capital preservation with zero risk', score: 1 },
        ],
    },
    {
        question: 'Have you experienced market crashes or volatility before?',
        options: [
            { text: 'Yes, and I invested more during dips', score: 4 },
            { text: 'Yes, I held my investments', score: 3 },
            { text: 'No, I’m new to investing', score: 2 },
            { text: 'Yes, and I exited my investments', score: 1 },
        ],
    },
    {
        question: 'What level of loss are you comfortable tolerating in a bad year?',
        options: [
            { text: 'More than 30%', score: 4 },
            { text: '10% to 30%', score: 3 },
            { text: 'Up to 10%', score: 2 },
            { text: 'I can’t tolerate losses', score: 1 },
        ],
    },
    {
        question: 'How soon will you need to withdraw your investment?',
        options: [
            { text: 'In more than 15 years', score: 4 },
            { text: 'In 10–15 years', score: 3 },
            { text: 'In 5–10 years', score: 2 },
            { text: 'Within 5 years', score: 1 },
        ],
    },
    {
        question: 'Which best describes your knowledge of financial markets?',
        options: [
            { text: 'Very experienced — I track and analyze regularly', score: 4 },
            { text: 'Somewhat knowledgeable — I follow updates', score: 3 },
            { text: 'Limited — I rely on others or apps', score: 2 },
            { text: 'No knowledge — just starting out', score: 1 },
        ],
    },
    {
        question: 'What kind of returns do you expect annually from your investments?',
        options: [
            { text: '15% or more', score: 4 },
            { text: '10–15%', score: 3 },
            { text: '6–10%', score: 2 },
            { text: 'Below 6%', score: 1 },
        ],
    },
]

function getRiskProfile(score) {
    if (score >= 22) return 'Aggressive'
    if (score >= 15) return 'Moderate'
    return 'Conservative'
}

const profileStyles = {
    Aggressive: {
        icon: '',
        colorBox: 'text-red-400 border-red-500 bg-red-900/20',
        button: 'from-red-500 to-pink-400 hover:from-red-600 hover:to-pink-500',
    },
    Moderate: {
        icon: '',
        colorBox: 'text-yellow-300 border-yellow-400 bg-yellow-800/20',
        button: 'from-yellow-400 to-amber-300 hover:from-yellow-500 hover:to-amber-400',
    },
    Conservative: {
        icon: '',
        colorBox: 'text-blue-400 border-blue-500 bg-blue-900/20',
        button: 'from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500',
    },
}

export default function RiskProfilePage() {
    const [answers, setAnswers] = useState({})
    const [profile, setProfile] = useState(null)
    const resultRef = useRef(null)

    useEffect(() => {
        document.documentElement.classList.add('dark')
    }, [])

    const handleOptionChange = (questionIndex, optionIndex) => {
        setAnswers({ ...answers, [questionIndex]: optionIndex })
    }

    const handleSubmit = () => {
        if (Object.keys(answers).length < questions.length) {
            toast.error('Please answer all questions before submitting.')
            return
        }

        const totalScore = Object.entries(answers).reduce(
            (acc, [qIndex, optIndex]) => acc + questions[qIndex].options[optIndex].score,
            0
        )
        const result = getRiskProfile(totalScore)
        setProfile(result)
        localStorage.setItem('riskProfile', result)

        setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
    }


    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-4 py-12">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
                    Risk Profile Assessment
                </h1>

                <div className="space-y-10">
                    {questions.map((q, index) => (
                        <div key={index} className="bg-[#1f2937] p-6 rounded-xl border border-gray-700">
                            <h2 className="text-lg font-semibold mb-4">{q.question}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {q.options.map((opt, optIdx) => {
                                    const selected = answers[index] === optIdx
                                    return (
                                        <button
                                            key={optIdx}
                                            type="button"
                                            onClick={() => handleOptionChange(index, optIdx)}
                                            className={`w-full px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                                                selected
                                                    ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                                                    : 'bg-[#111827] border-gray-600 text-gray-300 hover:bg-gray-800'
                                            }`}
                                        >
                                            {opt.text}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleSubmit}
                    className="mt-10 w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-cyan-600 hover:to-blue-700 text-white py-3 rounded-lg font-semibold text-lg"
                >
                    Submit & Reveal My Profile
                </button>

                {profile && (
                    <motion.div
                        ref={resultRef}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`mt-10 text-center border-2 p-6 rounded-xl ${profileStyles[profile].colorBox}`}
                    >
                        <h2 className="text-2xl font-bold mb-2">Your Risk Profile:</h2>
                        <p className="text-4xl font-extrabold tracking-wide">
                            {profile} {profileStyles[profile].icon}
                        </p>
                        <p className="mt-2 text-sm text-gray-300">
                            This will help us recommend a smart asset allocation.
                        </p>

                        <a
                            href="/mutual-funds"
                            className={`inline-block mt-6 bg-gradient-to-r ${profileStyles[profile].button} px-6 py-2 text-white font-medium rounded-lg transition-all`}
                        >
                            View Fund Recommendations
                        </a>
                    </motion.div>
                )}
            </div>
        </main>
    )
}



