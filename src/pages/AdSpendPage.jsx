import LayoutShell from '../components/LayoutShell.jsx'

export default function AdSpendPage() {
  return (
    <LayoutShell
      title="Ad spend"
      subtitle="Track marketing spend and attribution inputs (coming soon)."
    >
      <section className="rounded-xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-700 shadow-sm shadow-slate-100 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-200 dark:shadow-none">
        <p className="font-medium text-slate-900 dark:text-slate-50">
          Ad spend page is not wired yet.
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Next step: connect ad spend import + daily spend breakdown endpoints.
        </p>
      </section>
    </LayoutShell>
  )
}

