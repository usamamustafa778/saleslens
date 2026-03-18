import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { apiFetch } from '../lib/api.js'

export default function LoginPage() {
  const { token, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      navigate('/dashboard', { replace: true })
    }
  }, [token, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        throw new Error('Invalid email or password')
      }
      const json = await res.json()
      login(json.token, json.user)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl bg-slate-900/80 p-8 shadow-2xl shadow-black/40">
        <h1 className="text-xl font-semibold text-slate-50">Sign in to ProfitDesk</h1>
        <p className="mt-1 text-xs text-slate-400">
          Profit analytics for your ecommerce channels.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <p className="rounded-md bg-rose-900/40 px-3 py-2 text-xs text-rose-100">
              {error}
            </p>
          )}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-9 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-900/60"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-9 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-900/60"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex h-9 w-full items-center justify-center rounded-lg bg-emerald-500 text-xs font-semibold text-emerald-950 shadow hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="mt-4 text-center text-[11px] text-slate-400">
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            className="font-medium text-emerald-400 hover:text-emerald-300"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

