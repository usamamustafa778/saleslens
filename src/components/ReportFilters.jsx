import { useState } from 'react'

export default function ReportFilters({ onChange, loading }) {
  const [local, setLocal] = useState({
    from: '',
    to: '',
    channel: '',
    query: '',
  })

  function updateField(field, value) {
    const next = { ...local, [field]: value }
    setLocal(next)
    onChange?.(next)
  }

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm shadow-slate-100 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none sm:flex-row sm:items-end sm:justify-between">
      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            From
          </label>
          <input
            type="date"
            value={local.from}
            onChange={(e) => updateField('from', e.target.value)}
            className="h-9 rounded-lg border border-slate-200 bg-slate-50/80 px-2 text-xs text-slate-700 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-900/50"
            disabled={loading}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            To
          </label>
          <input
            type="date"
            value={local.to}
            onChange={(e) => updateField('to', e.target.value)}
            className="h-9 rounded-lg border border-slate-200 bg-slate-50/80 px-2 text-xs text-slate-700 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-900/50"
            disabled={loading}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Channel
          </label>
          <select
            value={local.channel}
            onChange={(e) => updateField('channel', e.target.value)}
            className="h-9 rounded-lg border border-slate-200 bg-slate-50/80 px-2 text-xs text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-900/50"
            disabled={loading}
          >
            <option value="">All channels</option>
            <option value="AMAZON">Amazon</option>
            <option value="SHOPIFY">Shopify</option>
            <option value="EBAY">eBay</option>
          </select>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 sm:max-w-xs">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Product / SKU
          </label>
          <input
            type="search"
            value={local.query}
            onChange={(e) => updateField('query', e.target.value)}
            placeholder="Search by product name or SKU…"
            className="h-9 rounded-lg border border-slate-200 bg-slate-50/80 px-3 text-xs text-slate-700 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-900/50"
            disabled={loading}
          />
        </div>
      </div>
    </section>
  )
}

