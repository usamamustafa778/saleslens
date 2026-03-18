import DashboardHeader from './DashboardHeader.jsx'
import { useTenant } from '../context/TenantContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { NavLink } from 'react-router-dom'
import {
  BarChart3,
  Box,
  ClipboardList,
  Megaphone,
  ScrollText,
  LogOut,
  ChevronDown,
} from 'lucide-react'

function NavItem({ to, icon: Icon, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition',
          isActive
            ? 'bg-white/10 text-white shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset]'
            : 'text-slate-300/80 hover:bg-white/5 hover:text-white',
        ].join(' ')
      }
    >
      <span className="flex items-center gap-2">
        {Icon && (
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-200/90 ring-1 ring-white/5 group-hover:bg-white/10">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
        <span className="text-sm font-medium">{children}</span>
      </span>
      {({ isActive }) =>
        isActive ? <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> : null
      }
    </NavLink>
  )
}

export default function LayoutShell({
  children,
  title = 'ProfitDesk Overview',
  subtitle = 'Live profitability snapshot powered by your orders, costs, and ad spend.',
}) {
  const { tenants, tenantId, switchTenant } = useTenant()
  const { user, logout } = useAuth()

  const activeName =
    tenants.find((t) => t.id === tenantId)?.name || 'Default tenant'

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-50">
      <aside className="hidden w-72 flex-col border-r border-white/5 bg-[#0f172a] px-5 py-6 sm:flex">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-400/20">
            <span className="text-sm font-semibold tracking-tight">PD</span>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight text-white">
              ProfitDesk
            </p>
            <p className="text-[11px] text-slate-400">Profit intelligence</p>
          </div>
        </div>

        <nav className="space-y-1">
          <NavItem to="/dashboard" icon={BarChart3}>
            Dashboard
          </NavItem>
          <NavItem to="/products" icon={Box}>
            Products
          </NavItem>
          <NavItem to="/orders" icon={ClipboardList}>
            Orders
          </NavItem>
          <NavItem to="/ad-spend" icon={Megaphone}>
            Ad spend
          </NavItem>
          <NavItem to="/reports" icon={ScrollText}>
            Reports
          </NavItem>
        </nav>

        <div className="mt-auto pt-5">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Workspace
                </p>
                <p className="mt-0.5 truncate text-xs font-medium text-white/90">
                  {activeName}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
            </div>
            <select
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-xs text-white/90 outline-none ring-emerald-500/30 focus:ring-2"
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

            <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/10 pt-3">
              <div className="min-w-0">
                <p className="truncate text-[11px] text-slate-300/80">
                  {user ? user.email : 'Not signed in'}
                </p>
                <p className="text-[10px] text-slate-400">Signed in</p>
              </div>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold text-white/90 transition hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 bg-slate-50 px-4 py-6 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <DashboardHeader
            title={title}
            subtitle={subtitle}
          />
          {children}
        </div>
      </main>
    </div>
  )
}

