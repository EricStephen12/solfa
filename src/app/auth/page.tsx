'use client'
import { useState } from 'react'
import { useAuth } from '@/context/AuthProvider'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const { supabase } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [loading, setLoading] = useState(false)
  const [signupSuccess, setSignupSuccess] = useState(false)
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    let res
    if (mode === 'login') {
      res = await supabase.auth.signInWithPassword({ email, password })
      setLoading(false)
      if (res.error) setError(res.error.message)
      else router.push('/')
    } else {
      res = await supabase.auth.signUp({ email, password })
      setLoading(false)
      if (res.error) setError(res.error.message)
      else setSignupSuccess(true)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {mode === 'login' ? 'Login' : 'Sign Up'}
      </h1>
      {signupSuccess ? (
        <div className="text-green-600 dark:text-green-400 text-center">
          Signup successful! Please check your email and click the verification link before logging in.
        </div>
      ) : (
        <form onSubmit={handleAuth} className="space-y-4">
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="w-full px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (mode === 'login' ? 'Logging in...' : 'Signing up...') : (mode === 'login' ? 'Login' : 'Sign Up')}
          </button>
        </form>
      )}
      <button
        onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setSignupSuccess(false); }}
        className="mt-4 w-full text-blue-600 dark:text-blue-400 hover:underline"
      >
        {mode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Login'}
      </button>
      {error && <div className="mt-4 text-red-600 dark:text-red-400 text-center">{error}</div>}
    </div>
  )
} 