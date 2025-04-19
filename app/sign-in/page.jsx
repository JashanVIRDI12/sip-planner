'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Eye, EyeOff } from 'lucide-react'

export default function AuthPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [mode, setMode] = useState('login')
    const [showPassword, setShowPassword] = useState(false)
    const [status, setStatus] = useState('')

    const router = useRouter()
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get('redirectTo') || '/'

    const handleAuth = async () => {
        setStatus(mode === 'login' ? 'Logging in...' : 'Creating account...')

        if (mode === 'login') {
            const { error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) {
                setStatus('Login failed: ' + error.message)
            } else {
                setStatus('')
                router.push(redirectTo)
            }
        } else {
            const { error } = await supabase.auth.signUp({ email, password })
            if (error) {
                if (
                    error.message.toLowerCase().includes('user already registered') ||
                    error.message.toLowerCase().includes('already')
                ) {
                    setStatus('An account with this email already exists. Please log in.')
                } else {
                    setStatus('Signup error: ' + error.message)
                }
            } else {
                setStatus(
                    'Signup successful! If this email is already registered, a new confirmation link has been sent. Check your inbox.'
                )
            }
        }
    }

    return (
        <main className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
            {/* ✨ Animated Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="w-full h-full bg-gradient-to-br from-blue-900 via-black to-zinc-900 opacity-60" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/30 via-transparent to-transparent animate-pulse blur-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent animate-ping blur-2xl" />
            </div>

            {/* Auth Card */}
            <div className="z-10 w-full max-w-md px-8 py-10 rounded-2xl shadow-xl border border-blue-500/20 backdrop-blur-xl bg-zinc-900/70 text-white">
                <h1 className="text-3xl font-extrabold text-center mb-6 text-blue-400 tracking-wide animate-fade-in-up">
                    {mode === 'login' ? 'Welcome Back' : 'Join SIP Planner'}
                </h1>

                <div className="space-y-6">
                    {/* Email Field */}
                    <div className="relative">
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="peer w-full p-4 pt-6 rounded-xl bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent text-sm"
                            placeholder="Email"
                            autoComplete="email"
                        />
                        <label
                            htmlFor="email"
                            className="absolute left-4 top-2 text-xs text-gray-400 transition-all duration-200
              peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500
              peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-400"
                        >
                            Email
                        </label>
                    </div>

                    {/* Password Field */}
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="peer w-full p-4 pt-6 pr-12 rounded-xl bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent text-sm [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                            placeholder="Password"
                            autoComplete="current-password"
                        />
                        <label
                            htmlFor="password"
                            className="absolute left-4 top-2 text-xs text-gray-400 transition-all duration-200
              peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500
              peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-400"
                        >
                            Password
                        </label>
                        <button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleAuth}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 font-semibold transition-all shadow-lg text-white"
                    >
                        {mode === 'login' ? 'Log In' : 'Sign Up'}
                    </button>

                    {/* Toggle Mode */}
                    <p className="text-center text-sm text-gray-400">
                        {mode === 'login' ? (
                            <>
                                Don’t have an account?{' '}
                                <span
                                    onClick={() => setMode('signup')}
                                    className="text-blue-400 cursor-pointer underline"
                                >
                  Sign up
                </span>
                            </>
                        ) : (
                            <>
                                Already have an account?{' '}
                                <span
                                    onClick={() => setMode('login')}
                                    className="text-blue-400 cursor-pointer underline"
                                >
                  Log in
                </span>
                            </>
                        )}
                    </p>

                    {/* Status Message */}
                    {status && (
                        <p className="mt-3 text-sm text-yellow-300 text-center font-medium bg-yellow-900/10 px-4 py-2 rounded-md border border-yellow-700/40">
                            {status}
                        </p>
                    )}
                </div>
            </div>
        </main>
    )
}









