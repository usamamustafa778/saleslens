import DashboardHeader from './DashboardHeader.jsx'
import { useTenant } from '../context/TenantContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function LayoutShell({ children }) {
  const { tenants, tenantId, switchTenant } = useTenant()
  const { user, logout } = useAuth()

  const activeName =
    tenants.find((t) => t.id === tenantId)?.name || 'Default tenant'

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-50">
      <aside className="hidden w-64 flex-col border-r border-slate-800 bg-slate-950/95 px-5 py-6 sm:flex">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
            <span className="text-sm font-semibold">PD</span>
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-slate-50">
              ProfitDesk
            </p>
            <p className="text-[11px] text-slate-500">Profit intelligence</p>
          </div>
        </div>

        <nav className="space-y-1 text-sm">
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-lg bg-slate-900 px-3 py-2 text-left text-slate-50"
          >
            <span>Dashboard</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </button>
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-slate-400 hover:bg-slate-900/60 hover:text-slate-50"
          >
            <span>Products</span>
          </button>
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-slate-400 hover:bg-slate-900/60 hover:text-slate-50"
          >
            <span>Orders</span>
          </button>
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-slate-400 hover:bg-slate-900/60 hover:text-slate-50"
          >
            <span>Ad spend</span>
          </button>
        </nav>

        <div className="mt-auto pt-4 text-[11px] text-slate-500">
          <p className="mb-2 truncate text-slate-400">
            {user ? user.email : 'Not signed in'}
          </p>
          <button
            type="button"
            onClick={logout}
            className="mb-3 w-full rounded-md border border-slate-800 px-2 py-1 text-left text-[11px] text-slate-300 hover:bg-slate-900"
          >
            Logout
          </button>
          <p className="font-medium text-slate-400">Workspace</p>
          <select
            className="mt-1 w-full rounded-md border border-slate-800 bg-slate-900 px-2 py-1 text-[11px] text-slate-100"
            value={tenantId}
            onChange={(e) => switchTenant(Number(e.target.value))}
          >
            {tenants.length === 0 ? (
              <option value={tenantId}>{activeName}</option>
            ) : (
              tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </option>
              ))
            )}
          </select>
        </div>
      </aside>

      <main className="flex-1 bg-slate-50 px-4 py-6 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <DashboardHeader
            title="ProfitDesk Overview"
            subtitle="Live profitability snapshot powered by your orders, costs, and ad spend."
          />
          {children}
        </div>
      </main>
    </div>
  )
}

