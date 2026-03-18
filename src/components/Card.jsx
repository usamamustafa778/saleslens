export default function Card({ title, value, subtitle }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm shadow-slate-100 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-50">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

