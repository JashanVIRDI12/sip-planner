'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const questions = [
    {
        question: 'What is your age group?',
        options: [
            { text: 'Under 25', score: 4 },
            { text: '25-35', score: 3 },
            { text: '36-50', score: 2 },
            { text: 'Above 50', score: 1 },
        ],
    },
    {
        question: 'What is your primary investment goal?',
        options: [
            { text: 'Maximum wealth growth', score: 4 },
            { text: 'Long-term appreciation with moderate risk', score: 3 },
            { text: 'Regular income & capital safety', score: 2 },
            { text: 'Preserve capital at all costs', score: 1 },
        ],
    },
    {
        question: 'How do you react to a 20% drop in your investment?',
        options: [
            { text: 'Buy more aggressively', score: 4 },
            { text: 'Stay calm and do nothing', score: 3 },
            { text: 'Worried but wait it out', score: 2 },
            { text: 'Sell everything immediately', score: 1 },
        ],
    },
    {
        question: 'What is your investment time horizon?',
        options: [
            { text: 'More than 15 years', score: 4 },
            { text: '10 to 15 years', score: 3 },
            { text: '5 to 10 years', score: 2 },
            { text: 'Less than 5 years', score: 1 },
        ],
    },
]

function getRiskProfile(score) {
    if (score >= 14) return 'Aggressive'
    if (score >= 10) return 'Moderate'
    return 'Conservative'
}

const profileStyles = {
    Aggressive: {
        icon: '🚀',
        colorBox: 'text-red-400 border-red-500 bg-red-900/20',
        button: 'from-red-500 to-pink-400 hover:from-red-600 hover:to-pink-500',
    },
    Moderate: {
        icon: '⚖️',
        colorBox: 'text-yellow-300 border-yellow-400 bg-yellow-800/20',
        button: 'from-yellow-400 to-amber-300 hover:from-yellow-500 hover:to-amber-400',
    },
    Conservative: {
        icon: '🛡️',
        colorBox: 'text-blue-400 border-blue-500 bg-blue-900/20',
        button: 'from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500',
    },
}

export default function RiskProfilePage() {
    const [answers, setAnswers] = useState({})
    const [profile, setProfile] = useState(null)

    useEffect(() => {
        document.documentElement.classList.add('dark')
    }, [])

    const handleOptionChange = (questionIndex, score) => {
        setAnswers({ ...answers, [questionIndex]: score })
    }

    const handleSubmit = () => {
        if (Object.keys(answers).length < questions.length) {
            alert('Please answer all questions.')
            return
        }
        const totalScore = Object.values(answers).reduce((a, b) => a + b, 0)
        const result = getRiskProfile(totalScore)
        setProfile(result)
        localStorage.setItem('riskProfile', result)
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-4 py-12">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
                    Risk Profile Assessment
                </h1>

                <div className="space-y-10">
                    {questions.map((q, index) => (
                        <div
                            key={index}
                            className="bg-[#1f2937] p-6 rounded-xl border border-gray-700 shadow-md transition"
                        >
                            <h2 className="text-lg font-semibold mb-4">{q.question}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {q.options.map((opt, optIdx) => {
                                    const selected = answers[index] === opt.score
                                    return (
                                        <button
                                            key={optIdx}
                                            type="button"
                                            onClick={() => handleOptionChange(index, opt.score)}
                                            className={`w-full px-4 py-2 rounded-lg border transition-all duration-200 text-sm font-medium ${
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
                    className="mt-10 w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-cyan-600 hover:to-blue-700 text-white py-3 rounded-lg font-semibold text-lg transition-all duration-200"
                >
                    Submit & Reveal My Profile
                </button>

                {profile && (
                    <motion.div
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
                            This will help us suggest suitable investment strategies.
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



