import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

function formatMoney(value) {
  if (value == null || Number.isNaN(value)) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDayLabel(value) {
  if (!value || value === '—') return value
  // value is YYYY-MM-DD
  const d = new Date(`${value}T00:00:00`)
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
}

export default function SalesTrendChart({ points, loading }) {
  const data =
    points && points.length > 0
      ? points
      : [
          { date: '—', revenue: 0, netProfit: 0 },
          { date: '—', revenue: 0, netProfit: 0 },
        ]

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm shadow-slate-100 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-slate-900 dark:text-slate-50">
            Sales trend
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Daily revenue over the last 30 days.
          </p>
        </div>
        {loading && (
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Loading chart…
          </span>
        )}
      </div>

      <div className="h-64 overflow-hidden rounded-lg border border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 16, right: 16, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDayLabel}
              tick={{ fontSize: 10, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
              minTickGap={18}
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
              labelFormatter={(label) => formatDayLabel(label)}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#4f46e5"
              fill="url(#revenueGradient)"
              strokeWidth={2}
              dot={false}
              name="Revenue"
            />
            <Area
              type="monotone"
              dataKey="netProfit"
              dot={false}
              stroke="#10b981"
              fill="url(#profitGradient)"
              strokeWidth={2}
              name="Net profit"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

