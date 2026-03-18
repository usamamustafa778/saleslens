import LayoutShell from '../components/LayoutShell.jsx'

export default function OrdersPage() {
  return (
    <LayoutShell
      title="Orders"
      subtitle="Inspect orders by channel and time period (coming soon)."
    >
      <section className="rounded-xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-700 shadow-sm shadow-slate-100 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-200 dark:shadow-none">
        <p className="font-medium text-slate-900 dark:text-slate-50">
          Orders page is not wired yet.
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Next step: add list view + order detail drawer and connect the backend orders endpoints.
        </p>
      </section>
    </LayoutShell>
  )
}

