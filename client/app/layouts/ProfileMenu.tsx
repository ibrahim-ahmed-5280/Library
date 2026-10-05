import { useEffect, useRef } from 'react'
import { ChevronDown, LogOut, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '../../features/auth/providers/AuthProvider'
import UserAvatar from '../../shared/components/UserAvatar'

export default function ProfileMenu() {
  const { user, signOut } = useAuth()
  const menu = useRef<HTMLDetailsElement>(null)
  const trigger = useRef<HTMLElement>(null)
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (menu.current && !menu.current.contains(event.target as Node)) menu.current.open = false
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menu.current?.open) {
        menu.current.open = false
        trigger.current?.focus()
      }
    }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', outside)
      document.removeEventListener('keydown', escape)
    }
  }, [])
  return (
    <details className="profile-menu" ref={menu}>
      <summary ref={trigger} aria-label="Account menu">
        <UserAvatar user={user} />
        <span className="profile-menu-name">
          {user?.name}
          <small>{user?.role === 'librarian' ? 'Staff' : 'Administrator'}</small>
        </span>
        <ChevronDown size={16} aria-hidden="true" />
      </summary>
      <div className="profile-dropdown">
        <Link
          to="/staff/profile"
          onClick={() => {
            if (menu.current) menu.current.open = false
          }}
        >
          <UserRound size={17} aria-hidden="true" />
          My profile
        </Link>
        <button
          type="button"
          onClick={() => {
            if (menu.current) menu.current.open = false
            void signOut().catch((error) => toast.error(error.message))
          }}
        >
          <LogOut size={17} aria-hidden="true" />
          Sign out
        </button>
      </div>
    </details>
  )
}
