import { useEffect, useMemo, useState } from 'react'
import { DollarSign, Megaphone, Package, TrendingUp } from 'lucide-react'
import MetricCard from '../components/MetricCard.jsx'
import SalesTrendChart from '../components/SalesTrendChart.jsx'
import LayoutShell from '../components/LayoutShell.jsx'
import { useTenant } from '../context/TenantContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

function formatCurrency(amount, currency = 'USD') {
  if (amount == null || Number.isNaN(amount)) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount)
}

export default function Dashboard() {
  const { tenantId } = useTenant()
  const { token } = useAuth()
  const [metrics, setMetrics] = useState({
    revenue: 0,
    cogs: 0,
    adSpend: 0,
    netProfit: 0,
    marginPercent: 0,
  })

  const [trend, setTrend] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError(null)

        const qs = `?tenantId=${tenantId}`
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const [summaryRes, trendRes, productsRes] = await Promise.all([
          fetch(`/api/dashboard/summary${qs}`, { headers }),
          fetch(`/api/dashboard/trend${qs}`, { headers }),
          fetch(`/api/products/profitability${qs}`, { headers }),
        ])

        if (!summaryRes.ok || !trendRes.ok || !productsRes.ok) {
          throw new Error('Failed to load dashboard data')
        }

        const [summaryJson, trendJson, productsJson] = await Promise.all([
          summaryRes.json(),
          trendRes.json(),
          productsRes.json(),
        ])

        if (cancelled) return

        setMetrics({
          revenue: summaryJson.revenue ?? 0,
          cogs: summaryJson.cogs ?? 0,
          adSpend: summaryJson.ad_spend ?? 0,
          netProfit: summaryJson.net_profit ?? 0,
          marginPercent: summaryJson.margin_percent ?? 0,
        })

        const trendPoints = (trendJson.trend || []).map((point) => ({
          date: point.date,
          revenue: point.revenue ?? 0,
          netProfit: point.net_profit ?? 0,
        }))
        setTrend(trendPoints)

        setProducts(productsJson.products || [])
      } catch (err) {
        setError(err.message || 'Something went wrong while loading the dashboard')
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [tenantId, token])

  const profitTone = useMemo(
    () => (metrics.netProfit > 0 ? 'positive' : metrics.netProfit < 0 ? 'negative' : 'neutral'),
    [metrics.netProfit],
  )

  return (
    <LayoutShell
      title="ProfitDesk Overview"
      subtitle="Live profitability snapshot powered by your orders, costs, and ad spend."
    >
      <section className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm shadow-slate-100 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1">
              <input
                type="search"
                placeholder="Search products (coming soon)…"
                className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50/80 px-3 text-xs text-slate-700 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-900/50"
                disabled
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="inline-flex h-9 items-center rounded-lg border border-dashed border-slate-300 px-3 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300"
              disabled
            >
              Date range · Last 30 days
            </button>
          </div>
        </section>

        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
            {error}
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Total revenue"
            value={formatCurrency(metrics.revenue)}
            helper="Sum of order totals"
            Icon={DollarSign}
          />
          <MetricCard
            label="Total COGS"
            value={formatCurrency(metrics.cogs)}
            helper="From latest product cost records"
            Icon={Package}
          />
          <MetricCard
            label="Total ad spend"
            value={formatCurrency(metrics.adSpend)}
            helper="From ad spend records"
            Icon={Megaphone}
          />
          <MetricCard
            label="Net profit"
            value={formatCurrency(metrics.netProfit)}
            helper="Revenue − COGS − ad spend"
            tone={profitTone}
            Icon={TrendingUp}
          />
        </section>

        <SalesTrendChart points={trend} loading={loading} />

        <section className="mt-4 rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm shadow-slate-100 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-900 dark:text-slate-50">
                Product profitability
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Top SKUs by revenue and margin.
              </p>
            </div>
          </div>
          {loading ? (
            <p className="text-xs text-slate-400 dark:text-slate-500">Loading products…</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs">
                <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  <tr>
                    <th className="py-2 pr-4">SKU</th>
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4 text-right">Revenue</th>
                    <th className="py-2 pr-4 text-right">Net profit</th>
                    <th className="py-2 pr-2 text-right">Margin %</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 10).map((product) => (
                    <tr
                      key={product.productId ?? product.sku ?? product.name}
                      className="border-b border-slate-100 text-[11px] last:border-0 dark:border-slate-800"
                    >
                      <td className="py-2 pr-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                        {product.sku || '—'}
                      </td>
                      <td className="py-2 pr-4 text-slate-700 dark:text-slate-200">
                        {product.name}
                      </td>
                      <td className="py-2 pr-4 text-right text-slate-700 dark:text-slate-200">
                        {formatCurrency(product.revenue)}
                      </td>
                      <td
                        className={`py-2 pr-4 text-right ${
                          product.netProfit > 0
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : product.netProfit < 0
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {formatCurrency(product.netProfit)}
                      </td>
                      <td className="py-2 pr-2 text-right text-slate-700 dark:text-slate-200">
                        {product.marginPercent?.toFixed(1) ?? '0.0'}%
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && !loading && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-3 text-center text-xs text-slate-400 dark:text-slate-500"
                      >
                        No product data yet. Import orders and costs to see profitability.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {loading && !error && (
          <p className="text-xs text-slate-400 dark:text-slate-500">Loading dashboard…</p>
        )}
    </LayoutShell>
  )
}

