export const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

// Centralized fetch wrapper so we don't rely on Vite dev-server proxy in production.
export async function apiFetch(url, options = {}) {
  if (!API_BASE) {
    // Helps diagnose missing build-time env vars on Vercel/production.
    throw new Error('VITE_API_BASE_URL is not set (frontend config missing).')
  }
  return fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })
}

