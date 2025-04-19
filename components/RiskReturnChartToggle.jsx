'use client'
import { useEffect, useState } from 'react'
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    LabelList,
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
} from 'recharts'

export function getRiskReturnData(profile = 'Moderate') {
    const dataByProfile = {
        Conservative: {
            equity: { return: 8, risk: 3 },
            debt: { return: 6, risk: 1 },
            gold: { return: 7, risk: 2 },
        },
        Moderate: {
            equity: { return: 12, risk: 6 },
            debt: { return: 6, risk: 2 },
            gold: { return: 8, risk: 4 },
        },
        Aggressive: {
            equity: { return: 15, risk: 9 },
            debt: { return: 5, risk: 3 },
            gold: { return: 10, risk: 5 },
        },
    }

    const { equity, debt, gold } = dataByProfile[profile] || dataByProfile['Moderate']

    return [
        { asset: 'Equity', return: equity.return, risk: equity.risk },
        { asset: 'Debt', return: debt.return, risk: debt.risk },
        { asset: 'Gold', return: gold.return, risk: gold.risk },
    ]
}

export default function RiskReturnChartToggle() {
    const [showRadar, setShowRadar] = useState(false)
    const [riskReturnData, setRiskReturnData] = useState([])

    useEffect(() => {
        const storedProfile = localStorage.getItem('riskProfile') || 'Moderate'
        const data = getRiskReturnData(storedProfile)
        setRiskReturnData(data)
    }, [])

    return (
        <div className="rounded-xl border border-blue-600 p-6 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] shadow-lg mb-10">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <span>Risk vs Return</span>
                </h2>
                <button
                    onClick={() => setShowRadar(!showRadar)}
                    className="text-sm bg-blue-700 hover:bg-blue-600 px-3 py-1 rounded text-white"
                >
                    {showRadar ? 'Switch to Bar' : 'Switch to Radar'}
                </button>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                {showRadar ? (
                    <RadarChart outerRadius={120} data={riskReturnData} margin={{ top: 30, bottom: 30 }}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="asset" stroke="#cbd5e1" />
                        <Radar
                            name="Avg Return (%)"
                            dataKey="return"
                            stroke="#60a5fa"
                            fill="#3b82f6"
                            fillOpacity={0.6}
                        />
                        <Radar
                            name="Risk Level"
                            dataKey="risk"
                            stroke="#fb923c"
                            fill="#f97316"
                            fillOpacity={0.6}
                        />

                        <Legend />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                        />
                    </RadarChart>
                ) : (
                    <BarChart
                        data={riskReturnData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                        barCategoryGap="20%"
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="asset" stroke="#cbd5e1" />
                        <YAxis stroke="#cbd5e1" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Legend
                            wrapperStyle={{ color: '#cbd5e1' }}
                            iconType="circle"
                            iconSize={10}
                        />
                        <Bar
                            dataKey="return"
                            fill="url(#returnGradient)"
                            radius={[4, 4, 0, 0]}
                            name="Avg Return (%)"
                            activeBar={{ fillOpacity: 1 }}
                        >
                            <LabelList dataKey="return" position="top" fill="#ffffff" />
                        </Bar>
                        <Bar
                            dataKey="risk"
                            fill="url(#riskGradient)"
                            radius={[4, 4, 0, 0]}
                            name="Risk Level"
                            activeBar={{ fillOpacity: 1 }}
                        >
                            <LabelList dataKey="risk" position="top" fill="#ffffff" />
                        </Bar>

                        {/* Gradients */}
                        <defs>
                            <linearGradient id="returnGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />
                                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.7} />
                            </linearGradient>
                            <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.9} />
                                <stop offset="95%" stopColor="#fb923c" stopOpacity={0.7} />
                            </linearGradient>
                        </defs>
                    </BarChart>
                )}
            </ResponsiveContainer>

            <p className="text-sm text-slate-300 mt-4 leading-relaxed">
                <span className="font-semibold text-white">Equity</span> offers higher returns with more volatility,&nbsp;
                <span className="font-semibold text-white">Debt</span> is stable with lower risk, and&nbsp;
                <span className="font-semibold text-white">Gold</span> sits in between as a hedge.
            </p>
        </div>
    )
}

