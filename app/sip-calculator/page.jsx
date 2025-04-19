'use client'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import CountUp from 'react-countup'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

// 🔹 Tooltip Component
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

// 🔹 SIP Calculation
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

// 🔹 Summary Tile with CountUp
function SummaryTile({ label, value, color }) {
    return (
        <div className="bg-white/5 border border-blue-500/30 backdrop-blur-lg p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
            <p className="text-gray-400 text-xs mb-1">{label}</p>
            <p className={`font-semibold text-lg sm:text-xl ${color}`}>
                ₹
                <CountUp
                    end={parseFloat(value)}
                    duration={2}
                    separator=","
                    decimals={0}
                    formattingFn={(val) => val.toLocaleString('en-IN')}
                />
            </p>
        </div>
    )
}

// 🔹 Chart + Table
function ChartAndTable({ data }) {
    if (!Array.isArray(data) || data.length === 0) return null

    const exportToCSV = () => {
        const headers = ['Year', 'Invested (₹)', 'Future Value (₹)', 'Gains (₹)']
        const rows = data.map((r) => [
            r.year,
            r.initial.toFixed(2),
            r.value.toFixed(2),
            r.gains.toFixed(2),
        ])
        const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'sip_projection.csv')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

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

            <div className="mt-6 overflow-x-auto text-sm rounded-lg border border-blue-700">
                <div className="min-w-[500px]">
                    <table className="w-full text-left text-sm text-gray-300">
                        <thead className="bg-gradient-to-r from-blue-900 to-blue-700 text-blue-200">
                        <tr>
                            <th className="p-3">Year</th>
                            <th className="p-3">Invested</th>
                            <th className="p-3">Future Value</th>
                            <th className="p-3">Gains</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((r) => (
                            <tr key={r.year} className="odd:bg-gray-900 even:bg-gray-800 border-b border-gray-700 hover:bg-blue-950/30 transition duration-200">
                                <td className="p-3">{r.year}</td>
                                <td className="p-3">₹{r.initial.toLocaleString('en-IN')}</td>
                                <td className="p-3">₹{r.value.toLocaleString('en-IN')}</td>
                                <td className="p-3 text-green-400">₹{r.gains.toLocaleString('en-IN')}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

// 🔹 Risk Profile Card
function RiskBasedCard({ profile }) {
    const profiles = {
        Aggressive: {
            title: 'Aggressive Investor',
            color: 'text-red-400',
            bg: 'bg-red-900/20',
            desc: 'Focus on high-risk equity SIPs for aggressive growth. Ideal for long-term high reward.',
        },
        Moderate: {
            title: 'Moderate Investor',
            color: 'text-yellow-300',
            bg: 'bg-yellow-800/20',
            desc: 'Balanced exposure to equity and debt. A safer path to wealth building.',
        },
        Conservative: {
            title: 'Conservative Investor',
            color: 'text-green-400',
            bg: 'bg-green-900/20',
            desc: 'Minimize risk by sticking to debt funds and fixed income instruments.',
        },
    }

    const current = profiles[profile]
    if (!current) return null

    return (
        <div className={`my-10 p-5 rounded-xl border-l-4 ${current.bg} ${current.color} border-current`}>
            <h2 className="text-xl font-bold">{current.title}</h2>
            <p className="mt-2 text-sm text-gray-300">{current.desc}</p>
        </div>
    )
}

// 🔹 Input Field
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

// 🔹 Main Component
export default function SipCalculatorPage() {
    const { register, handleSubmit } = useForm()
    const [result, setResult] = useState(null)
    const [riskProfile, setRiskProfile] = useState(null)

    useEffect(() => {
        document.documentElement.classList.add('dark')
        const storedProfile = localStorage.getItem('riskProfile')
        if (storedProfile) setRiskProfile(storedProfile)
    }, [])

    const onSubmit = (data) => {
        const monthlyInvestment = parseFloat(data.monthlyInvestment)
        const returnRate = parseFloat(data.returnRate)
        const duration = parseFloat(data.duration)
        if (isNaN(monthlyInvestment) || isNaN(returnRate) || isNaN(duration)) return

        const res = calculateSIP(monthlyInvestment, returnRate, duration)
        setResult({ ...res, monthlyInvestment, duration })
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-4 py-10">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-cyan-500 text-transparent bg-clip-text animate-gradient-x">
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
                </form>

                {riskProfile && <RiskBasedCard profile={riskProfile} />}

                {result && (
                    <>
                        <div className="mt-10 bg-gradient-to-br from-[#1f2937] to-[#111827] p-6 rounded-2xl border border-blue-700 shadow-2xl">
                            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 text-transparent bg-clip-text mb-6 text-center">
                                Investment Summary
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-center text-white text-sm sm:text-base mb-6">
                                <SummaryTile label="Initial Investment" value={result.monthlyInvestment * result.duration * 12} color="text-blue-400" />
                                <SummaryTile label="Future Value" value={parseFloat(result.futureValue)} color="text-cyan-400" />
                                <SummaryTile label="Total Gains" value={parseFloat(result.futureValue) - result.monthlyInvestment * result.duration * 12} color="text-green-400" />
                            </div>

                            <ChartAndTable data={result.chartData} />
                        </div>
                    </>
                )}
            </div>
        </main>
    )
}





