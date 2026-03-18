import { createContext, useContext, useEffect, useState } from 'react'
import { apiFetch } from '../lib/api.js'

const TenantContext = createContext(null)

function getStoredTenantId() {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem('activeTenantId')
  if (!raw) return null
  const parsed = Number(raw)
  return Number.isNaN(parsed) ? null : parsed
}

export function TenantProvider({ children }) {
  const [tenants, setTenants] = useState([])
  const [tenantId, setTenantId] = useState(getStoredTenantId() || 1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadTenants() {
      try {
        setLoading(true)
        const token = window.localStorage.getItem('authToken')
        const res = await apiFetch('/api/tenants', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })

        if (!res.ok) {
          throw new Error('Failed to load tenants')
        }

        const json = await res.json()
        setTenants(json.tenants || [])

        if (!tenantId && json.tenants && json.tenants.length > 0) {
          const firstId = json.tenants[0].id
          setTenantId(firstId)
          window.localStorage.setItem('activeTenantId', String(firstId))
        }
      } catch (error) {
        // silently ignore for now; unauthenticated users can still use tenant 1
      } finally {
        setLoading(false)
      }
    }

    loadTenants()
  }, [tenantId])

  async function switchTenant(nextId) {
    setTenantId(nextId)
    window.localStorage.setItem('activeTenantId', String(nextId))

    try {
      const token = window.localStorage.getItem('authToken')
      await apiFetch('/api/tenant/switch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ tenantId: nextId }),
      })
    } catch {
      // ignore; frontend still uses tenantId locally
    }
  }

  const value = {
    tenants,
    tenantId,
    loading,
    switchTenant,
  }

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
}

export function useTenant() {
  const ctx = useContext(TenantContext)
  if (!ctx) {
    throw new Error('useTenant must be used within TenantProvider')
  }
  return ctx
}

