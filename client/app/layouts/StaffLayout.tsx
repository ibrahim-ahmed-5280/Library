import Brand from '../../shared/components/Brand'
import ThemeButton from '../../shared/components/ThemeButton'
import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Library,
  Users,
  ArrowRightLeft,
  ClipboardList,
  BarChart3,
  Settings2,
  Menu,
  X,
  ShieldCheck,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../../features/auth/providers/AuthProvider'
import ProfileMenu from './ProfileMenu'
import { toast } from 'sonner'

const staffLinks = [
  { to: '/staff', label: 'Overview', icon: LayoutDashboard },
  { to: '/staff/inventory', label: 'Books & copies', icon: Library },
  { to: '/staff/members', label: 'Members', icon: Users },
  { to: '/staff/circulation', label: 'Circulation', icon: ArrowRightLeft },
  { to: '/staff/reservations', label: 'Reservations', icon: ClipboardList },
  { to: '/staff/contact', label: 'Contact messages', icon: ClipboardList },
  { to: '/staff/email', label: 'Email outbox', icon: ClipboardList },
  { to: '/staff/reports', label: 'Reports', icon: BarChart3 },
  { to: '/staff/team', label: 'Admins & staff', icon: ShieldCheck },
  { to: '/staff/audit', label: 'Audit history', icon: ShieldCheck },
  { to: '/staff/policies', label: 'Loan policies', icon: Settings2 },
  { to: '/staff/settings', label: 'Library details', icon: Settings2 },
]
export default function StaffLayout() {
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const current = staffLinks.find((link) => link.to === location.pathname)
  return (
    <div className="workspace">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand-header">
          <Brand />
        </div>
        <p className="sidebar-label">LIBRARY WORKSPACE</p>
        <nav aria-label="Staff navigation">
          {staffLinks
            .filter(
              (link) =>
                user?.role === 'admin' ||
                ![
                  '/staff/team',
                  '/staff/audit',
                  '/staff/policies',
                  '/staff/settings',
                  '/staff/email',
                ].includes(link.to),
            )
            .map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} end={to === '/staff'} onClick={() => setOpen(false)}>
                <Icon size={19} />
                {label}
              </NavLink>
            ))}
        </nav>
        <div className="sidebar-footer">
          <button
            type="button"
            onClick={() => {
              void signOut().catch((error) => toast.error(error.message))
            }}
          >
            <LogOut size={18} aria-hidden="true" />
            Sign out
          </button>
        </div>
      </aside>
      <div className="workspace-content">
        <header className="workspace-header">
          <div className="flex items-center gap-3">
            <button
              className="icon-button mobile-menu"
              onClick={() => setOpen(!open)}
              aria-label="Toggle staff navigation"
              aria-expanded={open}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span>
              Workspace <span className="muted">/</span>{' '}
              <strong>
                {current?.label ??
                  (location.pathname === '/staff/profile' ? 'My profile' : 'Overview')}
              </strong>
            </span>
          </div>
          <div className="nav-actions">
            <ThemeButton />
            <ProfileMenu />
          </div>
        </header>
        <main id="main" className="staff-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
