import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'

function formatMoney(value) {
  if (value == null || Number.isNaN(value)) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function TopChannelsCard({ channels, loading }) {
  const [sort, setSort] = useState({ key: 'revenue', dir: 'desc' })

  const sorted = useMemo(() => {
    const copy = [...(channels || [])]
    copy.sort((a, b) => {
      const av = Number(a?.[sort.key] ?? 0)
      const bv = Number(b?.[sort.key] ?? 0)
      return sort.dir === 'asc' ? av - bv : bv - av
    })
    return copy
  }, [channels, sort])

  const data = sorted.slice(0, 8).map((c) => ({
    channel: c.channel,
    revenue: c.revenue ?? 0,
    netProfit: c.netProfit ?? 0,
  }))

  function toggleSort(key) {
    setSort((current) => {
      if (current.key === key) {
        return { key, dir: current.dir === 'asc' ? 'desc' : 'asc' }
      }
      return { key, dir: 'desc' }
    })
  }

  function SortIcon({ active, dir }) {
    return (
      <span
        className={`ml-1 inline-block text-[10px] ${
          active ? 'text-slate-700 dark:text-slate-200' : 'text-slate-300 dark:text-slate-600'
        }`}
        aria-hidden="true"
      >
        {active ? (dir === 'asc' ? '▲' : '▼') : '↕'}
      </span>
    )
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm shadow-slate-100 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-slate-900 dark:text-slate-50">
            Top channels
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Revenue and net profit by channel.
          </p>
        </div>
        {loading && (
          <span className="text-xs text-slate-400 dark:text-slate-500">Loading…</span>
        )}
      </div>

      <div className="mt-3 grid gap-4 lg:grid-cols-2">
        <div className="h-64 overflow-hidden rounded-lg border border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/80">
          {loading ? (
            <div className="flex h-full flex-col justify-center gap-3 px-4">
              {Array.from({ length: 6 }).map((_, idx) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={idx} className="h-3 w-full animate-pulse rounded-full bg-slate-200/80 dark:bg-slate-800/60" />
              ))}
              <p className="mt-2 text-center text-[11px] text-slate-400 dark:text-slate-500">
                Loading channels…
              </p>
            </div>
          ) : data.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                No channel data yet
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Import orders to see revenue and profit by channel.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 16, right: 16, left: 16, bottom: 0 }}
                barCategoryGap={10}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="channel"
                  width={72}
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    borderColor: '#e5e7eb',
                    fontSize: 12,
                  }}
                  formatter={(value, name) => [formatMoney(value), name]}
                />
                <Legend />
                <Bar dataKey="revenue" name="Revenue" fill="#4f46e5" radius={[6, 6, 6, 6]} />
                <Bar dataKey="netProfit" name="Net profit" fill="#10b981" radius={[6, 6, 6, 6]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-950">
          <table className="min-w-full text-left text-xs">
            <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400">
              <tr>
                <th className="px-3 py-2">Channel</th>
                <th className="px-3 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => toggleSort('revenue')}
                    className="inline-flex items-center hover:text-slate-700 dark:hover:text-slate-200"
                    title="Sort by revenue"
                  >
                    Revenue
                    <SortIcon active={sort.key === 'revenue'} dir={sort.dir} />
                  </button>
                </th>
                <th className="px-3 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => toggleSort('netProfit')}
                    className="inline-flex items-center hover:text-slate-700 dark:hover:text-slate-200"
                    title="Sort by net profit"
                  >
                    Net profit
                    <SortIcon active={sort.key === 'netProfit'} dir={sort.dir} />
                  </button>
                </th>
                <th className="px-3 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => toggleSort('marginPercent')}
                    className="inline-flex items-center hover:text-slate-700 dark:hover:text-slate-200"
                    title="Sort by margin %"
                  >
                    Margin
                    <SortIcon active={sort.key === 'marginPercent'} dir={sort.dir} />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.slice(0, 8).map((c) => (
                <tr
                  key={c.channel}
                  className="border-b border-slate-100 text-[11px] last:border-0 hover:bg-slate-50 dark:border-slate-900 dark:hover:bg-slate-900/40"
                >
                  <td className="px-3 py-2">
                    <Link
                      to={`/channels/${encodeURIComponent(c.channel)}`}
                      className="font-medium text-emerald-700 hover:underline dark:text-emerald-400"
                    >
                      {c.channel}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-right text-slate-700 dark:text-slate-200">
                    {formatMoney(c.revenue)}
                  </td>
                  <td
                    className={`px-3 py-2 text-right ${
                      c.netProfit > 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : c.netProfit < 0
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-slate-700 dark:text-slate-200'
                    }`}
                    title="Net profit"
                  >
                    {formatMoney(c.netProfit)}
                  </td>
                  <td
                    className={`px-3 py-2 text-right ${
                      (c.marginPercent ?? 0) < 0
                        ? 'text-rose-600 dark:text-rose-400'
                        : (c.marginPercent ?? 0) >= 30
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-700 dark:text-slate-200'
                    }`}
                    title="Margin %"
                  >
                    {(c.marginPercent ?? 0).toFixed(1)}%
                  </td>
                </tr>
              ))}
              {(!channels || channels.length === 0) && !loading && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 py-6 text-center text-xs text-slate-400 dark:text-slate-500"
                  >
                    No channel data yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

