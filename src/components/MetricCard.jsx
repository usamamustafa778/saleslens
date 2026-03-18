export default function MetricCard({
  label,
  value,
  helper,
  tone = 'neutral',
  Icon,
}) {
  const toneClasses = {
    neutral:
      'border-slate-200 bg-white/80 shadow-slate-100 dark:border-slate-800 dark:bg-slate-900/70',
    positive:
      'border-emerald-200 bg-emerald-50/80 shadow-emerald-100/60 dark:border-emerald-900/60 dark:bg-emerald-950/40',
    negative:
      'border-rose-200 bg-rose-50/80 shadow-rose-100/60 dark:border-rose-900/60 dark:bg-rose-950/40',
  }

  return (
    <article
      className={`group rounded-xl border p-4 shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-md dark:shadow-none ${toneClasses[tone]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {value}
          </p>
          {helper && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helper}</p>
          )}
        </div>
        {Icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900/5 text-slate-500 group-hover:bg-slate-900/10 dark:bg-slate-50/5 dark:text-slate-300">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </div>
        )}
      </div>
    </article>
  )
}

