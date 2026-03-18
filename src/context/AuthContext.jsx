import { createContext, useContext, useEffect, useState } from 'react'
import { apiFetch } from '../lib/api.js'

const AuthContext = createContext(null)

function getStoredToken() {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem('authToken') || null
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getStoredToken)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(!!token)

  useEffect(() => {
    async function loadMe() {
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const res = await apiFetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error()
        const json = await res.json()
        setUser(json.user)
      } catch {
        setToken(null)
        window.localStorage.removeItem('authToken')
      } finally {
        setLoading(false)
      }
    }
    loadMe()
  }, [token])

  function login(nextToken, nextUser) {
    setToken(nextToken)
    setUser(nextUser || null)
    window.localStorage.setItem('authToken', nextToken)
  }

  function logout() {
    setToken(null)
    setUser(null)
    window.localStorage.removeItem('authToken')
  }

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

