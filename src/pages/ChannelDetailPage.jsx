import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import LayoutShell from '../components/LayoutShell.jsx'
import { useTenant } from '../context/TenantContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { apiFetch } from '../lib/api.js'
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

export default function ChannelDetailPage() {
  const { channel } = useParams()
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
        const res = await apiFetch(
          `/api/analytics/channels/${encodeURIComponent(channel)}?tenantId=${tenantId}`,
          { headers },
        )
        if (!res.ok) throw new Error('Failed to load channel details')
        const json = await res.json()
        if (cancelled) return
        setData(json)
      } catch (e) {
        setError(e.message || 'Failed to load channel details')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [channel, tenantId, token])

  const breakdown = useMemo(() => {
    if (!data?.breakdown) return []
    // Hide revenue slice so chart shows cost/profit composition
    return (data.breakdown || [])
      .filter((b) => b.key !== 'Revenue')
      .map((b) => ({ name: b.key, value: Math.abs(b.value ?? 0) }))
  }, [data])

  function downloadCsv() {
    const totals = data?.totals || {}
    const rows = [
      ['metric', 'value'],
      ['revenue', totals.revenue ?? 0],
      ['cogs', totals.cogs ?? 0],
      ['fees', totals.fees ?? 0],
      ['refunds', totals.refunds ?? 0],
      ['ad_spend', totals.adSpend ?? 0],
      ['net_profit', totals.netProfit ?? 0],
      ['margin_percent', totals.marginPercent ?? 0],
      [],
      ['date', 'revenue', 'net_profit'],
      ...(data?.trend || []).map((p) => [p.date, p.revenue ?? 0, p.netProfit ?? 0]),
    ]
    const csv = rows
      .map((r) => (r.length === 0 ? '' : r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')))
      .join('\n')
    const blob = new Blob([`${csv}\n`], { type: 'text/csv;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `channel-${channel}-profit.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)
  }

  return (
    <LayoutShell
      title={`Channel · ${channel}`}
      subtitle="Explainable profit breakdown: revenue → costs → net profit."
    >
      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
          {error}
        </div>
      )}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MiniCard label="Revenue" value={formatMoney(data?.totals?.revenue)} loading={loading} />
        <MiniCard label="COGS" value={formatMoney(data?.totals?.cogs)} loading={loading} />
        <MiniCard label="Fees" value={formatMoney(data?.totals?.fees)} loading={loading} />
        <MiniCard label="Refunds" value={formatMoney(data?.totals?.refunds)} loading={loading} />
        <MiniCard label="Ad spend" value={formatMoney(data?.totals?.adSpend)} loading={loading} />
        <MiniCard label="Net profit" value={formatMoney(data?.totals?.netProfit)} loading={loading} tone="profit" />
        <MiniCard label="Margin %" value={`${(data?.totals?.marginPercent ?? 0).toFixed(1)}%`} loading={loading} />
        <div className="flex items-stretch">
          <button
            type="button"
            onClick={downloadCsv}
            disabled={loading || !data}
            className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-left text-xs font-semibold text-slate-700 shadow-sm shadow-slate-100 transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-200 dark:shadow-none"
            title="Export this channel breakdown as CSV"
          >
            Export CSV
            <div className="mt-1 text-[11px] font-normal text-slate-500 dark:text-slate-400">
              Trend + totals
            </div>
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white/80 p-4 text-xs shadow-sm shadow-slate-100 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
        <p className="font-medium text-slate-900 dark:text-slate-50">Explainable profit formula</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-6">
          <FormulaPill label="Revenue" value={formatMoney(data?.totals?.revenue)} tone="good" />
          <FormulaPill label="Refunds" value={formatMoney(data?.totals?.refunds)} tone="bad" />
          <FormulaPill label="Fees" value={formatMoney(data?.totals?.fees)} tone="bad" />
          <FormulaPill label="Ad spend" value={formatMoney(data?.totals?.adSpend)} tone="bad" />
          <FormulaPill label="COGS" value={formatMoney(data?.totals?.cogs)} tone="bad" />
          <FormulaPill label="Net profit" value={formatMoney(data?.totals?.netProfit)} tone="neutral" strong />
        </div>
        <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
          Revenue − Refunds − Fees − Ad spend − COGS = Net profit
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm shadow-slate-100 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-900 dark:text-slate-50">
                Profit over time
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Daily revenue and net profit for this channel.
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
            Component breakdown for the selected channel.
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

function MiniCard({ label, value, loading, tone }) {
  const toneClasses =
    tone === 'profit'
      ? 'ring-1 ring-emerald-200 dark:ring-emerald-900/50'
      : 'ring-1 ring-slate-200 dark:ring-slate-800'

  return (
    <div className={`rounded-xl bg-white/80 px-4 py-3 shadow-sm shadow-slate-100 dark:bg-slate-900/70 dark:shadow-none ${toneClasses}`}>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-50">
        {loading ? '—' : value}
      </div>
    </div>
  )
}

function FormulaPill({ label, value, tone, strong }) {
  const cls =
    tone === 'good'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200'
      : tone === 'bad'
        ? 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200'
        : 'border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100'

  return (
    <div className={`rounded-lg border px-3 py-2 ${cls}`}>
      <div className="text-[11px] font-medium opacity-80">{label}</div>
      <div className={strong ? 'text-xs font-semibold' : 'text-xs'}>{value}</div>
    </div>
  )
}

