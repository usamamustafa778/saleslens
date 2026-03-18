export default function ChartPlaceholder() {
  return (
    <div className="flex h-64 flex-col justify-between rounded-xl border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100 p-4 text-left text-slate-500 dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 dark:text-slate-400">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Sales Trend (Placeholder)
          </p>
          <p className="mt-1 text-xs text-slate-400">
            This is a visual placeholder for ProfitDesk&apos;s future charts.
          </p>
        </div>
        <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-slate-500 shadow-sm dark:bg-slate-900/60">
          Coming soon
        </span>
      </div>
      <div className="mt-4 flex flex-1 items-end gap-1 rounded-lg bg-white/70 p-3 dark:bg-slate-900/60">
        {Array.from({ length: 16 }).map((_, index) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            className="flex-1 rounded-t-full bg-slate-200 dark:bg-slate-700"
            style={{
              height: `${20 + (index % 5) * 10}%`,
            }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-slate-400">
        <span>Last 30 days</span>
        <span>Sales volume</span>
      </div>
    </div>
  )
}

