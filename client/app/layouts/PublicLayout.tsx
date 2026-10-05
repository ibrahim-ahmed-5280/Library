import { useLibrarySettings, defaultLibrary } from '../../shared/hooks/useLibrarySettings'
import Brand from '../../shared/components/Brand'
import ThemeButton from '../../shared/components/ThemeButton'
import { useEffect } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { UserRoundPlus } from 'lucide-react'
import MobileNavigation from './MobileNavigation'
import { useAuth } from '../../features/auth/providers/AuthProvider'
import '../../features/information/styles/information.css'

export default function PublicLayout() {
  const library = useLibrarySettings()
  const name = library.data?.name ?? defaultLibrary.name
  useEffect(() => {
    document.title = `${name} | Library Management System`
  }, [name])
  const { user } = useAuth()
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="public-header">
        <div className="container nav-row">
          <Brand />
          <nav aria-label="Main navigation" className="public-nav">
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/catalog">Catalog</NavLink>
            <NavLink to="/help">Help</NavLink>
            <NavLink to="/faq">FAQ</NavLink>
            {user && <NavLink to="/account">My library</NavLink>}
            {user && user.role !== 'member' && <NavLink to="/staff">Staff workspace</NavLink>}
          </nav>
          <div className="nav-actions">
            <ThemeButton />
            <Link className="header-sign-in" to={user ? '/account' : '/login'}>
              {user ? user.name.split(' ')[0] : 'Sign in'}
            </Link>
            {!user && (
              <Link className="button header-register" to="/register">
                <UserRoundPlus size={18} aria-hidden="true" />
                Register
              </Link>
            )}
            <MobileNavigation />
          </div>
        </div>
      </header>
      <main id="main">
        <Outlet />
      </main>
      <footer className="public-footer-shell">
        <div className="public-footer-expanded container">
          <div className="footer-intro">
            <Brand />
            <p>A place for good stories, new perspectives, and your next chapter.</p>
          </div>
          <div className="footer-group">
            <h2>Explore your library</h2>
            <nav aria-label="Footer library navigation">
              <Link to="/catalog">Browse the collection</Link>
              <Link to="/about">About the library</Link>
              <Link to="/help">Contact the library</Link>
              <Link to="/faq">Borrowing guide & FAQ</Link>
            </nav>
          </div>
          <div className="footer-group">
            <h2>Your reading life</h2>
            <nav aria-label="Footer account navigation">
              <Link to="/account">My library account</Link>
              <Link to="/login">Membership & sign in</Link>
            </nav>
          </div>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} {name}
            </span>
            <span>Read something that makes you curious.</span>
          </div>
        </div>
      </footer>
    </>
  )
}
