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

function formatMoney(value) {
  if (value == null || Number.isNaN(value)) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function TopChannelsCard({ channels, loading }) {
  const data = (channels || []).slice(0, 8).map((c) => ({
    channel: c.channel,
    revenue: c.revenue ?? 0,
    netProfit: c.netProfit ?? 0,
  }))

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
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 16, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="channel"
                tick={{ fontSize: 10, fill: '#6b7280' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#6b7280' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  borderColor: '#e5e7eb',
                  fontSize: 12,
                }}
                formatter={(value, name) => [formatMoney(value), name]}
              />
              <Legend />
              <Bar dataKey="revenue" name="Revenue" fill="#22c55e" radius={[6, 6, 0, 0]} />
              <Bar dataKey="netProfit" name="Net profit" fill="#0f766e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-950">
          <table className="min-w-full text-left text-xs">
            <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400">
              <tr>
                <th className="px-3 py-2">Channel</th>
                <th className="px-3 py-2 text-right">Revenue</th>
                <th className="px-3 py-2 text-right">Net profit</th>
                <th className="px-3 py-2 text-right">Margin</th>
              </tr>
            </thead>
            <tbody>
              {(channels || []).slice(0, 8).map((c) => (
                <tr
                  key={c.channel}
                  className="border-b border-slate-100 text-[11px] last:border-0 dark:border-slate-900"
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
                  >
                    {formatMoney(c.netProfit)}
                  </td>
                  <td className="px-3 py-2 text-right text-slate-700 dark:text-slate-200">
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

