'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '/lib/supabaseClient'
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

                <ul className="hidden md:flex space-x-6 items-center font-semibold tracking-wide text-sm">
                    {[{ name: 'Home', href: '/' }, { name: 'Calculators', href: '/sip-calculator', submenu: true }, { name: 'Risk Profile', href: '/risk-profile' }, { name: 'Mutual Funds', href: '/mutual-funds' }, { name: 'SIP Mastery', href: '/sip-crash-course' }, { name: 'AI Advisor', href: '/investment-advisor' }].map((item, i) =>
                        item.submenu ? (
                            <li key={i} className="relative group">
                                <span className="text-gray-200 hover:text-white flex items-center gap-1 cursor-pointer transition-all duration-300 relative group">
                                    Calculators
                                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" viewBox="0 0 24 24" fill="none">
                                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                    <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-300 transition-all duration-300 group-hover:w-full rounded-full blur-sm"></span>
                                </span>
                                <ul className="absolute z-40 top-full mt-3 w-60 bg-zinc-900/80 border border-zinc-700 backdrop-blur-md rounded-lg shadow-xl opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-300 invisible group-hover:visible">
                                    <li>
                                        <Link href="/sip-calculator" className="block px-4 py-2 text-sm text-white hover:bg-blue-800/30 transition">
                                            Regular SIP Calculator
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/goal-based" className="block px-4 py-2 text-sm text-white hover:bg-blue-800/30 transition">
                                            Goal-Based SIP Calculator
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            <li key={i} className="relative group">
                                <Link
                                    href={item.href}
                                    className={`${pathname === item.href ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-300' : 'text-gray-300 hover:text-white'} relative transition-all duration-300`}
                                >
                                    {item.name}
                                    <span
                                        className={`absolute bottom-[-4px] left-0 h-0.5 rounded-full bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-300 blur-sm transition-all duration-300 ${pathname === item.href ? 'w-full' : 'w-0 group-hover:w-full'}`}
                                    ></span>
                                </Link>
                            </li>
                        )
                    )}
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
                                className={`relative flex items-center gap-2 px-4 py-1.5 font-semibold text-white rounded-full shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-400 bg-size-200 bg-pos-0 hover:bg-pos-100 animate-gradient-x ${
                                    showDropdown ? 'ring-2 ring-blue-400' : ''
                                }`}
                                style={{
                                    backgroundSize: '200% 100%',
                                    backgroundPosition: '0% 0%',
                                }}
                            >
    <span className="capitalize tracking-wide text-sm drop-shadow-sm">
      {profile?.email.split('@')[0]}
    </span>
                                <svg
                                    className={`w-4 h-4 transform transition-transform duration-300 ${
                                        showDropdown ? 'rotate-180' : ''
                                    }`}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <path d="M6 9l6 6 6-6" stroke="white" strokeWidth="2" />
                                </svg>
                            </button>

                            {showDropdown && (
                                <div className="absolute right-0 mt-4 w-72 rounded-2xl border border-white/40 bg-white/30 backdrop-blur-md shadow-2xl p-5 z-50 animate-fade-in-fast transition-all duration-500">
                                    <div className="text-sm text-white space-y-2">
                                        <p>
                                            <span className="text-blue-300 font-medium">Email:</span> {profile?.email}
                                        </p>
                                        <p>
                                            <span className="text-blue-300 font-medium">Risk Profile:</span>{' '}
                                            <span className="text-slate-200 font-semibold">{profile?.riskProfile}</span>
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleSignOut}
                                        className="mt-4 w-full text-sm text-left font-semibold text-red-400 hover:text-red-300 transition-all duration-200"
                                    >
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
                <div className="md:hidden bg-[#0f172a] px-6 py-6 border-t border-zinc-800 space-y-6 animate-fade-in-up">
                    <ul className="space-y-3 text-sm font-semibold text-white">
                        {[{ name: 'Home', href: '/' }, { name: 'Calculators', submenu: true }, { name: 'Risk Profile', href: '/risk-profile' }, { name: 'Mutual Funds', href: '/mutual-funds' }, { name: 'SIP Mastery', href: '/sip-crash-course' }, { name: 'AI Advisor', href: '/investment-advisor' }].map((item, i) =>
                            item.submenu ? (
                                <details key={i} className="group rounded-lg overflow-hidden">
                                    <summary className="flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer text-white hover:bg-blue-900/30 transition-all duration-300 [&::-webkit-details-marker]:hidden">
                                        <span className="group-hover:text-cyan-300 transition">Calculators</span>
                                        <svg className="w-4 h-4 transform group-open:rotate-180 transition-transform duration-300 text-cyan-300" viewBox="0 0 24 24" fill="none">
                                            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" />
                                        </svg>
                                    </summary>
                                    <ul className="ml-4 mt-2 space-y-2">
                                        <li>
                                            <Link href="/sip-calculator" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-blue-300 hover:bg-blue-800/30 rounded-md transition">
                                                Regular SIP Calculator
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/goal-based" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-blue-300 hover:bg-blue-800/30 rounded-md transition">
                                                Goal-Based SIP Calculator
                                            </Link>
                                        </li>
                                    </ul>
                                </details>
                            ) : (
                                <li key={i}>
                                    <Link href={item.href} onClick={() => setMobileOpen(false)} className="block px-4 py-2 rounded-lg bg-transparent hover:bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 hover:text-white text-gray-200 transition-all duration-300">
                                        {item.name}
                                    </Link>
                                </li>
                            )
                        )}
                    </ul>
                </div>
            )}
        </header>
    )
}







