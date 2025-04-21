'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
    const pathname = usePathname()
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [showDropdown, setShowDropdown] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)

        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.user) {
                setUser(session.user)
                const risk = localStorage.getItem('riskProfile')
                setProfile({ email: session.user.email, riskProfile: risk || 'Not set' })
            }
        }

        getSession()

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser(session.user)
                const risk = localStorage.getItem('riskProfile')
                setProfile({ email: session.user.email, riskProfile: risk || 'Not set' })
            } else {
                setUser(null)
                setProfile(null)
            }
        })

        return () => {
            listener?.subscription.unsubscribe()
        }
    }, [])

    useEffect(() => {
        setShowDropdown(false)
        setMobileOpen(false)
    }, [pathname])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        setUser(null)
        setProfile(null)
        router.push('/')
    }

    if (!mounted) return null

    return (
        <header className="sticky top-0 z-50 bg-gradient-to-br from-[#0f172a]/70 to-black/70 backdrop-blur-lg border-b border-gray-800 shadow-md">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link
                    href="/"
                    className="text-white text-xl font-bold font-orbitron tracking-widest uppercase"
                >
                    SIP Planner
                </Link>

                {/* Desktop Nav */}
                <ul className="hidden md:flex space-x-6 text-sm font-medium items-center">
                    <li>
                        <Link href="/" className={pathname === '/' ? 'text-blue-500' : 'text-gray-300 hover:text-white'}>
                            Home
                        </Link>
                    </li>
                    <li className="relative group">
            <span className="text-gray-300 hover:text-white flex items-center gap-1 cursor-pointer">
              Calculators
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
                        <ul className="absolute z-40 top-full mt-2 w-56 bg-zinc-900 border border-zinc-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-300 invisible group-hover:visible">
                            <li>
                                <Link href="/sip-calculator" className="block px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800">
                                    Regular SIP Calculator
                                </Link>
                            </li>
                            <li>
                                <Link href="/goal-based" className="block px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800">
                                    Goal-Based SIP Calculator
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <Link href="/risk-profile" className={pathname === '/risk-profile' ? 'text-blue-500' : 'text-gray-300 hover:text-white'}>
                            Risk Profile
                        </Link>
                    </li>
                    <li>
                        <Link href="/mutual-funds" className={pathname === '/mutual-funds' ? 'text-blue-500' : 'text-gray-300 hover:text-white'}>
                            Mutual Funds
                        </Link>
                    </li>
                    <li>
                        <Link href="/sip-crash-course" className={pathname === '/sip-crash-course' ? 'text-blue-500' : 'text-gray-300 hover:text-white'}>
                            SIP Mastery
                        </Link>
                    </li>
                </ul>

                {/* Right Side */}
                <div className="hidden md:flex items-center space-x-3 relative">
                    {!user ? (
                        <button
                            onClick={() => router.push('/sign-in?redirectTo=' + pathname)}
                            className="inline-flex items-center text-sm font-medium rounded-lg px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg hover:shadow-blue-500/40 transition-all duration-300"
                        >
                            Sign In
                        </button>
                    ) : (
                        <div className="relative">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center gap-2 text-sm font-semibold px-4 py-1.5 bg-zinc-900 border border-gray-600 rounded-full text-white hover:bg-zinc-800 transition"
                            >
                                {profile?.email.split('@')[0]}
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </button>
                            {showDropdown && (
                                <div className="absolute right-0 mt-3 w-60 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl z-50 p-4 space-y-3">
                                    <div className="text-sm text-gray-300 leading-5">
                                        <p><span className="text-gray-500">Email:</span> {profile?.email}</p>
                                        <p><span className="text-gray-500">Risk Profile:</span> <span className="text-blue-400">{profile?.riskProfile}</span></p>
                                    </div>
                                    <button onClick={handleSignOut} className="mt-2 w-full text-left text-sm text-red-400 hover:text-red-500 transition">
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile hamburger */}
                <button className="md:hidden text-gray-300" onClick={() => setMobileOpen(!mobileOpen)}>
                    {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </nav>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden bg-[#0f172a] px-6 py-4 border-t border-zinc-800 space-y-4">
                    <ul className="space-y-3 text-sm font-medium text-white">
                        <li>
                            <Link href="/" onClick={() => setMobileOpen(false)} className="block px-4 py-2 rounded-lg hover:bg-blue-800/30 transition">
                                Home
                            </Link>
                        </li>
                        <details className="group rounded-lg overflow-hidden">
                            <summary className="flex items-center justify-between px-4 py-2 rounded-lg text-white cursor-pointer hover:bg-blue-800/30 transition appearance-none [&::-webkit-details-marker]:hidden">
                                <span>Calculators</span>
                                <svg className="w-4 h-4 group-open:rotate-180 transform transition-transform duration-300" viewBox="0 0 24 24" fill="none">
                                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </summary>
                            <ul className="mt-2 ml-2 space-y-1">
                                <li>
                                    <Link href="/sip-calculator" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-sm text-blue-200 hover:bg-blue-700/40 transition rounded-md">
                                        Regular SIP Calculator
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/goal-based" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-sm text-blue-200 hover:bg-blue-700/40 transition rounded-md">
                                        Goal-Based SIP Calculator
                                    </Link>
                                </li>
                            </ul>
                        </details>
                        <li>
                            <Link href="/risk-profile" onClick={() => setMobileOpen(false)} className="block px-4 py-2 rounded-lg hover:bg-blue-800/30 transition">
                                Risk Profile
                            </Link>
                        </li>
                        <li>
                            <Link href="/mutual-funds" onClick={() => setMobileOpen(false)} className="block px-4 py-2 rounded-lg hover:bg-blue-800/30 transition">
                                Mutual Funds
                            </Link>
                        </li>
                        <li>
                            <Link href="/sip-crash-course" onClick={() => setMobileOpen(false)} className="block px-4 py-2 rounded-lg hover:bg-blue-800/30 transition">
                                SIP Mastery
                            </Link>
                        </li>
                    </ul>

                    {!user ? (
                        <button onClick={() => { setMobileOpen(false); router.push('/sign-in?redirectTo=' + pathname) }} className="w-full text-sm font-semibold px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg transition">
                            Sign In
                        </button>
                    ) : (
                        <div className="text-sm text-gray-300 space-y-2">
                            <p><span className="text-gray-400">Email:</span> {profile?.email}</p>
                            <p><span className="text-gray-400">Risk Profile:</span> <span className="text-blue-400 font-medium">{profile?.riskProfile}</span></p>
                            <button onClick={() => { setMobileOpen(false); handleSignOut() }} className="w-full text-left text-red-400 hover:text-red-500 text-sm mt-2">
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            )}
        </header>
    )
}







