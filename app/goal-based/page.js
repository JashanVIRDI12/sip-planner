'use client'
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts'

function CustomTooltip({ active, payload }) {
    if (active && payload && payload.length) {
        return (
            <div className="backdrop-blur-md bg-white/10 border border-blue-500 rounded-lg px-4 py-3 shadow-xl transition-all duration-300 transform hover:scale-105">
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

function calculateRequiredSIP(goal, rate, years) {
    const months = years * 12
    const monthlyRate = rate / 12 / 100
    const sip = (goal * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1)

    let futureValue = 0
    let chartData = []

    for (let i = 1; i <= months; i++) {
        futureValue = (futureValue + sip) * (1 + monthlyRate)
        if (i % 12 === 0) {
            const year = i / 12
            chartData.push({
                year,
                invested: parseFloat((sip * year * 12).toFixed(2)),
                value: parseFloat(futureValue.toFixed(2)),
                gains: parseFloat((futureValue - sip * year * 12).toFixed(2)),
            })
        }
    }

    return {
        sip: sip.toFixed(2),
        chartData,
        futureValue: futureValue.toFixed(2),
    }
}

function InputField({ label, value, onChange }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
            <input
                type="tel"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Enter value..."
                className="w-full bg-[#111827] text-white rounded-lg border border-gray-600 px-3 py-2 text-sm outline-none ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-blue-500"
            />
        </div>
    )
}

export default function GoalBasedSIP() {
    const [target, setTarget] = useState('')
    const [rate, setRate] = useState('')
    const [years, setYears] = useState('')
    const [result, setResult] = useState(null)
    const [showAll, setShowAll] = useState(false)

    const contentRef = useRef(null)
    const containerRef = useRef(null)

    useLayoutEffect(() => {
        if (contentRef.current && containerRef.current) {
            const contentHeight = contentRef.current.scrollHeight
            containerRef.current.style.maxHeight = showAll ? `${contentHeight}px` : `300px`
        }
    }, [showAll, result])

    useEffect(() => {
        document.documentElement.classList.add('dark')
    }, [])

    const handleCalculate = () => {
        if (!target || !rate || !years) return
        const res = calculateRequiredSIP(parseFloat(target), parseFloat(rate), parseFloat(years))
        setResult({ ...res, target, rate, years })
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-4 py-12">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-cyan-500 text-transparent bg-clip-text animate-gradient-x">
                    Goal-Based SIP Calculator
                </h1>

                <div className="bg-[#1f2937] p-6 rounded-xl border border-blue-700 shadow-md">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <InputField label="Target Amount (₹)" value={target} onChange={setTarget} />
                        <InputField label="Expected Return Rate (% p.a.)" value={rate} onChange={setRate} />
                        <InputField label="Years to Goal" value={years} onChange={setYears} />
                    </div>
                    <button
                        onClick={handleCalculate}
                        className="mt-6 w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 py-2 sm:py-3 text-sm sm:text-base rounded-lg font-bold transition"
                    >
                        Calculate SIP
                    </button>
                </div>

                {result && (
                    <div className="mt-10 bg-[#1f2937] p-6 rounded-xl border border-blue-700">
                        <h2 className="text-xl sm:text-2xl font-semibold text-center text-blue-300 mb-2">
                            Required SIP: ₹{result.sip}/month
                        </h2>
                        <p className="text-center text-sm text-gray-400 mb-6">
                            To reach ₹{parseFloat(result.target).toLocaleString('en-IN')} in {result.years} years at {result.rate}%
                        </p>

                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                                data={result.chartData}
                                margin={{ top: 20, right: 20, bottom: 5, left: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="year" stroke="#aaa" />
                                <YAxis
                                    stroke="#ccc"
                                    tickFormatter={(v) =>
                                        v >= 1e7
                                            ? `${(v / 1e7).toFixed(1)}Cr`
                                            : v >= 1e5
                                                ? `${(v / 1e5).toFixed(1)}L`
                                                : v.toLocaleString('en-IN')
                                    }
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#60a5fa"
                                    strokeWidth={2}
                                    name="Future Value"
                                    dot={false}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="invested"
                                    stroke="#34d399"
                                    strokeDasharray="5 5"
                                    name="Invested"
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>

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
                                                    {result.chartData.map((row, index) => (
                                                        <div
                                                            key={row.year}
                                                            className={`grid grid-cols-4 px-5 py-4 border-t border-gray-700 transition-all duration-300 hover:scale-[1.015] hover:shadow-md ${
                                                                index % 2 === 0 ? 'bg-[#0f172a]/80' : 'bg-[#1e293b]/80'
                                                            }`}
                                                        >
                                                            <div className="text-blue-400 font-semibold">{row.year}</div>
                                                            <div className="text-gray-200">₹{row.invested.toLocaleString('en-IN')}</div>
                                                            <div className="text-cyan-300">₹{row.value.toLocaleString('en-IN')}</div>
                                                            <div className="text-green-400 font-medium">₹{row.gains.toLocaleString('en-IN')}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {result.chartData.length > 5 && (
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
                )}
            </div>
        </main>
    )
}






