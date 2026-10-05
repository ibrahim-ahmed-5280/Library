import * as Dialog from '@radix-ui/react-dialog'
import { Menu, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Brand from '../../shared/components/Brand'
import { useAuth } from '../../features/auth/providers/AuthProvider'

export default function MobileNavigation() {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()
  useEffect(() => {
    const query = window.matchMedia('(min-width: 801px)')
    const closeOnDesktop = () => {
      if (query.matches) setOpen(false)
    }
    query.addEventListener('change', closeOnDesktop)
    return () => query.removeEventListener('change', closeOnDesktop)
  }, [])
  const links = [
    ['/', 'Home'],
    ['/about', 'About'],
    ['/catalog', 'Catalog'],
    ['/help', 'Help'],
    ['/faq', 'FAQ'],
    ...(user
      ? [
          ['/account', 'My library'],
          ...(user.role !== 'member' ? [['/staff', 'Staff workspace']] : []),
        ]
      : [
          ['/login', 'Sign in'],
          ['/register', 'Register'],
        ]),
  ]
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="icon-button mobile-menu" aria-label="Toggle navigation">
          <Menu size={22} aria-hidden="true" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="navigation-overlay" />
        <Dialog.Content className="navigation-sidebar" aria-describedby={undefined}>
          <Dialog.Title className="sr-only">Library navigation</Dialog.Title>
          <div className="navigation-sidebar-heading">
            <Brand />
            <Dialog.Close className="icon-button" aria-label="Close navigation">
              <X size={22} aria-hidden="true" />
            </Dialog.Close>
          </div>
          <nav aria-label="Mobile navigation">
            {links.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}>
                {label}
              </NavLink>
            ))}
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
