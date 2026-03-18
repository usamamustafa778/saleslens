import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import LayoutShell from '../components/LayoutShell.jsx'
import { useTenant } from '../context/TenantContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
} from 'recharts'

function formatMoney(value) {
  if (value == null || Number.isNaN(value)) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)
}

const COLORS = ['#22c55e', '#f97316', '#e11d48', '#06b6d4', '#a855f7', '#0f766e']

export default function ProductDetailPage() {
  const { sku } = useParams()
  const { tenantId } = useTenant()
  const { token } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const res = await fetch(
          `/api/analytics/products/${encodeURIComponent(sku)}?tenantId=${tenantId}`,
          { headers },
        )
        if (!res.ok) throw new Error('Failed to load product details')
        const json = await res.json()
        if (cancelled) return
        setData(json)
      } catch (e) {
        setError(e.message || 'Failed to load product details')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [sku, tenantId, token])

  const breakdown = useMemo(() => {
    if (!data?.breakdown) return []
    return (data.breakdown || [])
      .filter((b) => b.key !== 'Revenue')
      .map((b) => ({ name: b.key, value: Math.abs(b.value ?? 0) }))
  }, [data])

  return (
    <LayoutShell
      title={`Product · ${sku}`}
      subtitle="Explainable profit breakdown: revenue → costs → net profit."
    >
      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
          {error}
        </div>
      )}

      <section className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm shadow-slate-100 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-900 dark:text-slate-50">
                Profit over time
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Daily revenue and net profit for this SKU.
              </p>
            </div>
            {loading && <span className="text-xs text-slate-400">Loading…</span>}
          </div>
          <div className="mt-3 h-64 overflow-hidden rounded-lg border border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.trend || []} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, borderColor: '#e5e7eb', fontSize: 12 }}
                  formatter={(v, n) => [formatMoney(v), n]}
                />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} dot={false} name="Revenue" />
                <Line type="monotone" dataKey="netProfit" stroke="#0f766e" strokeWidth={2} dot={false} name="Net profit" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm shadow-slate-100 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
          <h2 className="text-sm font-semibold tracking-wide text-slate-900 dark:text-slate-50">
            Profit explanation
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Cost components and net profit.
          </p>

          <div className="mt-3 h-56 overflow-hidden rounded-lg border border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={breakdown}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={2}
                >
                  {breakdown.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 8, borderColor: '#e5e7eb', fontSize: 12 }}
                  formatter={(v) => formatMoney(v)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 space-y-2 text-xs">
            <Row label="Revenue" value={formatMoney(data?.totals?.revenue)} />
            <Row label="COGS" value={formatMoney(data?.totals?.cogs)} />
            <Row label="Fees" value={formatMoney(data?.totals?.fees)} />
            <Row label="Refunds" value={formatMoney(data?.totals?.refunds)} />
            <Row label="Ad spend" value={formatMoney(data?.totals?.adSpend)} />
            <div className="my-2 border-t border-slate-200 dark:border-slate-800" />
            <Row label="Net profit" value={formatMoney(data?.totals?.netProfit)} strong />
            <Row label="Margin %" value={`${(data?.totals?.marginPercent ?? 0).toFixed(1)}%`} />
          </div>
        </section>
      </section>
    </LayoutShell>
  )
}

function Row({ label, value, strong }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className={strong ? 'font-semibold text-slate-900 dark:text-slate-50' : 'text-slate-700 dark:text-slate-200'}>
        {value}
      </span>
    </div>
  )
}

