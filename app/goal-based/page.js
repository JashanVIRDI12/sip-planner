'use client'
import React, { useState, useEffect } from 'react'
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

export default function GoalBasedSIP() {
    const [target, setTarget] = useState('')
    const [rate, setRate] = useState('')
    const [years, setYears] = useState('')
    const [result, setResult] = useState(null)

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
                                <table className="min-w-full text-sm text-left text-gray-300">
                                    <thead className="bg-gradient-to-r from-blue-900 to-blue-700 text-blue-200">
                                    <tr>
                                        <th className="px-4 py-3">Year</th>
                                        <th className="px-4 py-3">Invested</th>
                                        <th className="px-4 py-3">Future Value</th>
                                        <th className="px-4 py-3">Gains</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {result.chartData.map((row) => (
                                        <tr key={row.year} className="odd:bg-gray-900 even:bg-gray-800 border-b border-gray-700 hover:bg-blue-950/30 transition duration-200">
                                            <td className="px-4 py-3">{row.year}</td>
                                            <td className="px-4 py-3">₹{row.invested.toLocaleString('en-IN')}</td>
                                            <td className="px-4 py-3">₹{row.value.toLocaleString('en-IN')}</td>
                                            <td className="px-4 py-3 text-green-400">₹{row.gains.toLocaleString('en-IN')}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
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




