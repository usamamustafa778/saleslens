import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

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
          <LineChart data={data} margin={{ top: 16, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
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
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#22c55e"
              fill="#22c55e33"
              name="Revenue"
            />
            <Line
              type="monotone"
              dataKey="netProfit"
              stroke="#0f766e"
              strokeWidth={2}
              dot={false}
              name="Net profit"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

