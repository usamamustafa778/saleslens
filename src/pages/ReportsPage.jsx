import { useEffect, useMemo, useState } from 'react'
import LayoutShell from '../components/LayoutShell.jsx'
import ReportFilters from '../components/ReportFilters.jsx'
import ExportButton from '../components/ExportButton.jsx'
import { useTenant } from '../context/TenantContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const PAGE_SIZE = 20

function formatCurrency(amount) {
  if (amount == null || Number.isNaN(amount)) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(amount)
}

export default function ReportsPage() {
  const { tenantId } = useTenant()
  const { token } = useAuth()
  const [filters, setFilters] = useState({})
  const [rows, setRows] = useState([])
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState({ field: 'date', direction: 'desc' })
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams()
        params.append('tenantId', tenantId)
        if (filters.from) params.append('from', filters.from)
        if (filters.to) params.append('to', filters.to)
        if (filters.channel) params.append('channel', filters.channel)
        if (filters.query) params.append('query', filters.query)

        const res = await fetch(`/api/reports?${params.toString()}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })

        if (!res.ok) {
          throw new Error('Failed to load reports')
        }

        const json = await res.json()
        if (cancelled) return

        setRows(json.rows || [])
        setPage(1)
      } catch (err) {
        setError(err.message || 'Something went wrong while loading reports')
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
  }, [filters, tenantId, token])

  const sortedRows = useMemo(() => {
    const copy = [...rows]
    copy.sort((a, b) => {
      const { field, direction } = sort
      const aVal = a[field]
      const bVal = b[field]
      if (aVal == null && bVal == null) return 0
      if (aVal == null) return direction === 'asc' ? -1 : 1
      if (bVal == null) return direction === 'asc' ? 1 : -1

      if (field === 'date') {
        const aTime = new Date(aVal).getTime()
        const bTime = new Date(bVal).getTime()
        return direction === 'asc' ? aTime - bTime : bTime - aTime
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return direction === 'asc' ? aVal - bVal : bVal - aVal
      }

      return direction === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal))
    })
    return copy
  }, [rows, sort])

  const pageCount = Math.max(1, Math.ceil(sortedRows.length / PAGE_SIZE))
  const pagedRows = sortedRows.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  )

  function toggleSort(field) {
    setSort((current) => {
      if (current.field === field) {
        return {
          field,
          direction: current.direction === 'asc' ? 'desc' : 'asc',
        }
      }
      return { field, direction: 'desc' }
    })
  }

  async function handleExport() {
    try {
      setExporting(true)

      const params = new URLSearchParams()
      params.append('tenantId', tenantId)
      if (filters.from) params.append('from', filters.from)
      if (filters.to) params.append('to', filters.to)
      if (filters.channel) params.append('channel', filters.channel)
      if (filters.query) params.append('query', filters.query)

      const res = await fetch(`/api/reports/export?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (!res.ok) throw new Error('Export failed')

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      const disposition = res.headers.get('Content-Disposition') || ''
      const match = disposition.match(/filename="?(.+)"?/)
      link.download = match?.[1] || 'profitdesk-report.csv'
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(err.message || 'Export failed')
    } finally {
      setExporting(false)
    }
  }

  return (
    <LayoutShell
      title="Reports"
      subtitle="Filter, export, and audit profitability across channels."
    >
      <ReportFilters
        loading={loading}
        onChange={(next) => setFilters(next)}
      />

      <div className="mt-4 flex items-center justify-between gap-2">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Showing {pagedRows.length} of {rows.length} records
        </p>
        <ExportButton
          loading={exporting}
          disabled={rows.length === 0}
          onExport={handleExport}
        />
      </div>

      {error && (
        <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
          {error}
        </div>
      )}

      <section className="mt-4 rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm shadow-slate-100 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-wide text-slate-900 dark:text-slate-50">
            Profit & performance reports
          </h2>
        </div>

        {loading ? (
          <p className="text-xs text-slate-400 dark:text-slate-500">Loading reports…</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                <tr>
                  <th
                    className="cursor-pointer py-2 pr-4"
                    onClick={() => toggleSort('date')}
                  >
                    Date
                  </th>
                  <th
                    className="cursor-pointer py-2 pr-4"
                    onClick={() => toggleSort('channel')}
                  >
                    Channel
                  </th>
                  <th
                    className="cursor-pointer py-2 pr-4"
                    onClick={() => toggleSort('sku')}
                  >
                    SKU
                  </th>
                  <th className="py-2 pr-4">Product</th>
                  <th
                    className="cursor-pointer py-2 pr-4 text-right"
                    onClick={() => toggleSort('revenue')}
                  >
                    Revenue
                  </th>
                  <th
                    className="cursor-pointer py-2 pr-4 text-right"
                    onClick={() => toggleSort('cogs')}
                  >
                    COGS
                  </th>
                  <th
                    className="cursor-pointer py-2 pr-4 text-right"
                    onClick={() => toggleSort('fees')}
                  >
                    Fees
                  </th>
                  <th
                    className="cursor-pointer py-2 pr-4 text-right"
                    onClick={() => toggleSort('adSpend')}
                  >
                    Ad spend
                  </th>
                  <th
                    className="cursor-pointer py-2 pr-4 text-right"
                    onClick={() => toggleSort('netProfit')}
                  >
                    Net profit
                  </th>
                  <th
                    className="cursor-pointer py-2 pr-2 text-right"
                    onClick={() => toggleSort('marginPercent')}
                  >
                    Margin %
                  </th>
                </tr>
              </thead>
              <tbody>
                {pagedRows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-slate-100 text-[11px] last:border-0 dark:border-slate-800"
                  >
                    <td className="py-2 pr-4 text-slate-600 dark:text-slate-300">
                      {row.date?.slice(0, 10)}
                    </td>
                    <td className="py-2 pr-4 text-slate-600 dark:text-slate-300">
                      {row.channel || '—'}
                    </td>
                    <td className="py-2 pr-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      {row.sku || '—'}
                    </td>
                    <td className="py-2 pr-4 text-slate-700 dark:text-slate-200">
                      {row.productName || '—'}
                    </td>
                    <td className="py-2 pr-4 text-right text-slate-700 dark:text-slate-200">
                      {formatCurrency(row.revenue)}
                    </td>
                    <td className="py-2 pr-4 text-right text-slate-700 dark:text-slate-200">
                      {formatCurrency(row.cogs)}
                    </td>
                    <td className="py-2 pr-4 text-right text-slate-700 dark:text-slate-200">
                      {formatCurrency(row.fees)}
                    </td>
                    <td className="py-2 pr-4 text-right text-slate-700 dark:text-slate-200">
                      {formatCurrency(row.adSpend)}
                    </td>
                    <td
                      className={`py-2 pr-4 text-right ${
                        row.netProfit > 0
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : row.netProfit < 0
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {formatCurrency(row.netProfit)}
                    </td>
                    <td className="py-2 pr-2 text-right text-slate-700 dark:text-slate-200">
                      {row.marginPercent?.toFixed(1) ?? '0.0'}%
                    </td>
                  </tr>
                ))}
                {pagedRows.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={10}
                      className="py-3 text-center text-xs text-slate-400 dark:text-slate-500"
                    >
                      No report rows match your filters yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            Page {page} of {pageCount}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-md border border-slate-200 px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <button
              type="button"
              className="rounded-md border border-slate-200 px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700"
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={page === pageCount}
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </LayoutShell>
  )
}

