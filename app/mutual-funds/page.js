'use client'
import { useEffect, useState } from 'react'
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from 'recharts'
import RiskReturnChartToggle from "@/components/RiskReturnChartToggle";

const allocations = {
    Conservative: [
        { name: 'Equity', value: 20 },
        { name: 'Debt', value: 70 },
        { name: 'Gold', value: 10 },
    ],
    Moderate: [
        { name: 'Equity', value: 50 },
        { name: 'Debt', value: 40 },
        { name: 'Gold', value: 10 },
    ],
    Aggressive: [
        { name: 'Equity', value: 75 },
        { name: 'Debt', value: 20 },
        { name: 'Gold', value: 5 },
    ],
}

const fundRecommendations = {
    Equity: [
        { name: 'Quant Small Cap Fund', type: 'Small Cap Fund', code: '100177', amc: 'Quant' },
        { name: 'Parag Parikh Flexi Cap Fund', type: 'Flexi Cap Fund', code: '122640', amc: 'PPFAS' },
        { name: 'Mirae Asset Large Cap Fund', type: 'Large Cap Fund', code: '118834', amc: 'Mirae' },
        { name: 'Nippon India Growth Fund', type: 'Mid Cap Fund', code: '118550', amc: 'Nippon' },
        { name: 'SBI Bluechip Fund', type: 'Large Cap Fund', code: '119564', amc: 'SBI' },
        { name: 'Axis Midcap Fund', type: 'Mid Cap Fund', code: '119715', amc: 'Axis' },
    ],
    Debt: [
        { name: 'DSP Gilt Fund', type: 'Gilt Fund', code: '119101', amc: 'DSP' },
        { name: 'HDFC Corporate Bond Fund', type: 'Corporate Bond Fund', code: '132849', amc: 'HDFC' },
        { name: 'ICICI Prudential Short Term Fund', type: 'Short Term Debt Fund', code: '119780', amc: 'ICICI' },
    ],
    Gold: [
        { name: 'HDFC Gold ETF', type: 'ETF', code: '119132', amc: 'HDFC' },
        { name: 'SBI Gold Fund', type: 'Mutual Fund', code: '119788', amc: 'SBI' },
        { name: 'Nippon India Gold Savings Fund', type: 'Gold Savings', code: '119135', amc: 'Nippon' },
    ],
}

const COLORS = ['#60a5fa', '#34d399', '#fbbf24']

function FundCard({ fund }) {
    const [navData, setNavData] = useState(null)

    useEffect(() => {
        if (!fund.code) return
        fetch(`https://api.mfapi.in/mf/${fund.code}`)
            .then((res) => res.json())
            .then((data) => {
                if (data?.data?.length) {
                    setNavData(data.data[0])
                }
            })
            .catch(() => setNavData(null))
    }, [fund.code])

    return (
        <div className="bg-[#111827] border border-gray-700 rounded-lg p-4 shadow hover:shadow-lg transition">
            <h4 className="font-bold text-white mb-1">{fund.name}</h4>
            <p className="text-sm text-gray-400">{fund.type}</p>
            <p className="text-sm text-gray-400">AMC: {fund.amc}</p>
            {navData ? (
                <>
                    <p className="text-sm text-gray-200">NAV: ₹{navData.nav}</p>
                    <p className="text-xs text-gray-500">As of: {navData.date}</p>
                </>
            ) : (
                <p className="text-sm text-gray-500 italic">Fetching NAV...</p>
            )}
            <p className="text-sm text-gray-500 mt-2">Fund Code: {fund.code}</p>
        </div>
    )
}

export default function MutualFundPage() {
    const [profile, setProfile] = useState(null)
    const [allocationData, setAllocationData] = useState([])

    useEffect(() => {
        const stored = localStorage.getItem('riskProfile')
        if (stored) {
            setProfile(stored)
            setAllocationData(allocations[stored])
        }
    }, [])

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-4 py-12">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-6">SIP Asset Allocation</h1>

                {profile ? (
                    <>
                        <p className="text-center text-lg mb-4">
                            Based on your <span className="text-blue-400 font-semibold">{profile}</span> risk profile
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                            <div className="bg-[#1f2937] rounded-lg border border-gray-700 p-6">
                                <h2 className="text-xl font-semibold mb-4">Recommended Allocation</h2>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={allocationData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            label
                                            dataKey="value"
                                        >
                                            {allocationData.map((_, i) => (
                                                <Cell key={i} fill={COLORS[i]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>


                            <div className="bg-[#1f2937] rounded-lg border border-gray-700 p-6">
                                <h2 className="text-xl font-semibold mb-4">Allocation Breakdown</h2>
                                <table className="w-full text-left text-sm">
                                    <thead className="text-gray-400">
                                    <tr>
                                        <th className="pb-2">Asset</th>
                                        <th className="pb-2">Percentage</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {allocationData.map((item, i) => (
                                        <tr key={i} className="border-t border-gray-700">
                                            <td className="py-2">{item.name}</td>
                                            <td className="py-2">{item.value}%</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <RiskReturnChartToggle />
                        <h2 className="text-2xl font-semibold mb-4">Fund Recommendations</h2>

                        {allocationData.map((section, i) => (
                            <div key={i} className="mb-6">
                                <h3 className="text-xl font-semibold text-cyan-400 mb-2">{section.name}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {(fundRecommendations[section.name] || []).map((fund, j) => (
                                        <FundCard key={j} fund={fund} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <div className="text-center mt-10 text-gray-400">
                        <p>
                            No risk profile found. Please{' '}
                            <a href="/risk-profile" className="text-blue-400 underline">
                                take the quiz
                            </a>{' '}
                            first.
                        </p>
                    </div>
                )}
            </div>
        </main>
    )
}

