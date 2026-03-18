export default function ExportButton({ loading, disabled, onExport }) {
  const isDisabled = loading || disabled

  return (
    <button
      type="button"
      onClick={onExport}
      disabled={isDisabled}
      className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-slate-900 px-3 text-xs font-medium text-slate-50 shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-200 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-100 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
    >
      <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
      <span>{isDisabled ? 'Preparing…' : 'Export CSV/XLSX'}</span>
    </button>
  )
}

