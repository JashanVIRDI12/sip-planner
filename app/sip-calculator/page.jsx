'use client'
import React, { useState, useRef, useLayoutEffect} from 'react'
import { useForm } from 'react-hook-form'
import CountUp from 'react-countup'
import { useRouter } from 'next/navigation'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

// Tooltip Component
function CustomTooltip({ active, payload }) {
    if (active && payload && payload.length) {
        return (
            <div className="backdrop-blur-md bg-white/10 border border-blue-500 rounded-lg px-4 py-3 shadow-xl">
                <p className="text-sm text-blue-300 font-semibold">
                    Future Value: ₹{parseFloat(payload[0].value).toLocaleString('en-IN')}
                </p>
                <p className="text-sm text-green-400 font-medium">
                    Invested: ₹{parseFloat(payload[1].value).toLocaleString('en-IN')}
                </p>
            </div>
        )
    }
    return null
}

// SIP Calculation
function calculateSIP(monthlyInvestment, rate, years) {
    const months = years * 12
    const monthlyRate = rate / 12 / 100
    let futureValue = 0
    let data = []

    for (let m = 1; m <= months; m++) {
        futureValue = (futureValue + monthlyInvestment) * (1 + monthlyRate)
        if (m % 12 === 0) {
            const year = m / 12
            const investedSoFar = monthlyInvestment * 12 * year
            data.push({
                year,
                value: parseFloat(futureValue.toFixed(2)),
                initial: parseFloat(investedSoFar.toFixed(2)),
                gains: parseFloat((futureValue - investedSoFar).toFixed(2)),
            })
        }
    }

    return { futureValue: futureValue.toFixed(2), chartData: data }
}

// Summary Tile
function SummaryTile({ label, value, color }) {
    return (
        <div className="bg-white/5 border border-blue-500/30 backdrop-blur-lg p-4 rounded-xl shadow-md">
            <p className="text-gray-400 text-xs mb-1">{label}</p>
            <p className={`font-semibold text-lg sm:text-xl ${color}`}>
                ₹
                <CountUp
                    end={parseFloat(value)}
                    duration={2}
                    separator=","
                    formattingFn={(val) => val.toLocaleString('en-IN')}
                />
            </p>
        </div>
    )
}

function ChartAndTable({ data }) {
    const [showAll, setShowAll] = useState(false)
    const contentRef = useRef(null)
    const containerRef = useRef(null)

    useLayoutEffect(() => {
        if (contentRef.current && containerRef.current) {
            const contentHeight = contentRef.current.scrollHeight
            containerRef.current.style.maxHeight = showAll
                ? `${contentHeight}px`
                : `300px` // height for 5 rows approx.
        }
    }, [showAll, data])

    if (!Array.isArray(data) || data.length === 0) return null

    return (
        <>
            <div className="h-72 mt-6">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 20, right: 20, bottom: 5, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="year" stroke="#ccc" />
                        <YAxis
                            stroke="#ccc"
                            tickFormatter={(v) =>
                                v >= 1e7 ? `${(v / 1e7).toFixed(1)}Cr` :
                                    v >= 1e5 ? `${(v / 1e5).toFixed(1)}L` :
                                        v.toLocaleString('en-IN')
                            }
                            tick={{ fill: '#ccc', fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="#60a5fa" strokeWidth={2} dot={false} name="Future Value" />
                        <Line type="monotone" dataKey="initial" stroke="#10b981" strokeDasharray="5 5" strokeWidth={2} dot={false} name="Initial Investment" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-6 w-full overflow-x-auto">
                <div className="min-w-[500px]">
                    <table className="w-full text-sm text-left text-gray-300 backdrop-blur-sm rounded-xl overflow-hidden border border-blue-700/30 shadow-xl">
                        <thead className="bg-gradient-to-r from-blue-800 to-blue-700 text-blue-100 text-sm">
                        <tr>
                            <th className="px-5 py-3">Year</th>
                            <th className="px-5 py-3">Invested</th>
                            <th className="px-5 py-3">Future Value</th>
                            <th className="px-5 py-3">Gains</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td colSpan={4} className="p-0">
                                <div
                                    ref={containerRef}
                                    style={{
                                        overflow: 'hidden',
                                        transition: 'max-height 0.6s ease-in-out',
                                    }}
                                >
                                    <div ref={contentRef}>
                                        {data.map((row, index) => {
                                            return (
                                                <div
                                                    key={row.year}
                                                    className={`grid grid-cols-4 px-5 py-4 border-t border-gray-700 transition-all duration-300 hover:scale-[1.015] hover:shadow-md ${
                                                        index % 2 === 0 ? 'bg-[#0f172a]/80' : 'bg-[#1e293b]/80'
                                                    }`}
                                                >
                                                    <div className="text-blue-400 font-semibold">{row.year}</div>
                                                    <div className="text-gray-200">₹{row.initial.toLocaleString('en-IN')}</div>
                                                    <div className="text-cyan-300">₹{row.value.toLocaleString('en-IN')}</div>
                                                    <div className="text-green-400 font-medium">₹{row.gains.toLocaleString('en-IN')}</div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                {data.length > 5 && (
                    <div className="mt-4 text-center">
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="text-sm text-blue-400 hover:text-blue-300 transition"
                        >
                            {showAll ? 'Show Less ▲' : 'Show More ▼'}
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}


// Input Field
const Input = React.forwardRef(({ label, type = 'tel', ...props }, ref) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <input
            type={type}
            ref={ref}
            {...props}
            placeholder="Enter value"
            className="w-full bg-[#111827] text-white rounded-lg border border-gray-600 px-3 py-2 text-sm outline-none ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-blue-500"
        />
    </div>
))
Input.displayName = 'Input'

// Main Component
export default function SipCalculatorPage() {
    const { register, handleSubmit } = useForm()
    const [result, setResult] = useState(null)
    const resultRef = useRef(null)
    const router = useRouter()

    const onSubmit = (data) => {
        const monthlyInvestment = parseFloat(data.monthlyInvestment)
        const returnRate = parseFloat(data.returnRate)
        const duration = parseFloat(data.duration)
        if (isNaN(monthlyInvestment) || isNaN(returnRate) || isNaN(duration)) return

        const res = calculateSIP(monthlyInvestment, returnRate, duration)
        setResult({ ...res, monthlyInvestment, duration })

        setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-4 py-10">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-cyan-500 text-transparent bg-clip-text animate-gradient-x">
                    Regular SIP Calculator
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="bg-[#1f2937] p-6 rounded-xl border border-gray-700">
                    <Input label="Monthly Investment (₹)" {...register('monthlyInvestment', { required: true })} />
                    <Input label="Expected Return Rate (% annually)" {...register('returnRate', { required: true })} />
                    <Input label="Investment Duration (years)" {...register('duration', { required: true })} />

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-2 rounded-lg font-semibold transition"
                    >
                        Calculate
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push('/goal-based')}
                        className="mt-3 w-full border border-blue-500 text-blue-400 hover:bg-blue-800/30 py-2 rounded-lg font-semibold transition"
                    >
                        Try Goal-Based SIP
                    </button>
                </form>

                {result && (
                    <div ref={resultRef} className="mt-10 bg-gradient-to-br from-[#1f2937] to-[#111827] p-6 rounded-2xl border border-blue-700 shadow-2xl">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 text-transparent bg-clip-text mb-6 text-center">
                            Investment Summary
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-center text-white text-sm sm:text-base mb-6">
                            <SummaryTile label="Initial Investment" value={result.monthlyInvestment * result.duration * 12} color="text-blue-400" />
                            <SummaryTile label="Future Value" value={parseFloat(result.futureValue)} color="text-cyan-400" />
                            <SummaryTile label="Total Gains" value={parseFloat(result.futureValue) - result.monthlyInvestment * result.duration * 12} color="text-green-400" />
                        </div>

                        <ChartAndTable data={result.chartData} />
                    </div>
                )}
            </div>
        </main>
    )
}





