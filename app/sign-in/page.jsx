'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '/lib/supabaseClient'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

function AuthForm() {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState('')
    const [alreadySignedIn, setAlreadySignedIn] = useState(false)
    const [mode, setMode] = useState('magic') // 'magic' or 'google'

    const router = useRouter()

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setAlreadySignedIn(true)
                setStatus('You are already signed in. Redirecting...')
                setTimeout(() => router.push('/'), 3000)
            }
        })
    }, [router])

    const handleMagicLogin = async () => {
        if (!email) return setStatus('Please enter your email.')

        setStatus('Sending magic link...')
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/`,
            },
        })

        setStatus(
            error ? 'Failed to send link: ' + error.message : '✅ Check your email for the magic login link.'
        )
    }

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/`,
            },
        })

        if (error) setStatus('Google sign-in failed: ' + error.message)
    }

    if (alreadySignedIn) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="text-center p-6 rounded-xl bg-zinc-900/80 border border-blue-500/30 shadow-lg">
                    <h2 className="text-2xl font-bold text-blue-400 mb-4">Already Signed In</h2>
                    <p className="text-sm text-gray-300">{status}</p>
                </div>
            </main>
        )
    }

    return (
        <main className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
            {/* Background gradients */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="w-full h-full bg-gradient-to-br from-blue-900 via-black to-zinc-900 opacity-60" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/30 via-transparent to-transparent animate-pulse blur-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent animate-ping blur-2xl" />
            </div>

            <div className="z-10 w-full max-w-md px-8 py-10 rounded-2xl shadow-xl border border-blue-500/20 backdrop-blur-xl bg-zinc-900/70 text-white">
                <h1 className="text-3xl font-extrabold text-center mb-6 text-blue-400 tracking-wide animate-fade-in-up">
                    {mode === 'magic' ? 'Sign in with Magic Link' : 'Sign in with Google'}
                </h1>

                <div className="space-y-6">
                    {mode === 'magic' && (
                        <>
                            <div className="relative">
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="peer w-full p-4 pt-6 rounded-xl bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent text-sm text-white"
                                    placeholder="Email"
                                    autoComplete="email"
                                />
                                <label
                                    htmlFor="email"
                                    className="absolute left-4 top-2 text-xs text-gray-400 transition-all duration-200 peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-400"
                                >
                                    Email
                                </label>
                            </div>

                            <button
                                onClick={handleMagicLogin}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 font-semibold transition-all shadow-lg text-white"
                            >
                                Send Magic Link
                            </button>
                        </>
                    )}

                    {mode === 'google' && (
                        <button
                            onClick={handleGoogleLogin}
                            className="w-full py-3 rounded-xl bg-gray-200 text-black font-semibold hover:bg-gray-300 transition-all shadow flex items-center justify-center gap-3"
                        >
                            <Image
                                src="/google.png"
                                alt="Google"
                                width={20}
                                height={20}
                            />
                            Continue with Google
                        </button>
                    )}

                    {/* Mode toggle */}
                    <p className="text-sm text-center text-gray-400 mt-4">
                        {mode === 'magic' ? (
                            <>
                                Want to use Google instead?{' '}
                                <button className="underline text-blue-400" onClick={() => { setStatus(''); setMode('google') }}>
                                    Sign in with Google
                                </button>
                            </>
                        ) : (
                            <>
                                Prefer email?{' '}
                                <button className="underline text-blue-400" onClick={() => { setStatus(''); setMode('magic') }}>
                                    Use Magic Link
                                </button>
                            </>
                        )}
                    </p>

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

export default function AuthWrapper() {
    return (
        <Suspense fallback={<div className="text-white text-center mt-20">Loading...</div>}>
            <AuthForm />
        </Suspense>
    )
}


















