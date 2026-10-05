import { AnimatePresence, motion as Motion } from 'framer-motion'
import {
  BookOpenText,
  Menu,
  Moon,
  Search,
  ShoppingBag,
  Sun,
  UserRound,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useLibrary } from '../../context/LibraryContext.jsx'
import { useTheme } from '../../context/ThemeContext.jsx'
import { popularCategories } from '../../data/mockData.js'
import { cn } from '../../utils/cn.js'
import Button from '../common/Button.jsx'
import Input from '../common/Input.jsx'

const primaryLinks = [
  { label: 'Home', to: '/' },
  { label: 'Catalog', to: '/catalog' },
  { label: 'Events', to: '/events' },
  { label: 'Account', to: '/account' },
]

const secondaryLinks = [
  { label: 'Browse', to: '/catalog' },
  { label: 'New Arrivals', to: '/catalog?sort=new' },
  { label: 'Bestsellers', to: '/catalog?sort=rating' },
  { label: 'Events', to: '/events' },
  { label: 'Blog', href: '/#blog' },
  { label: 'Contact', href: '/#contact' },
]

function Navbar() {
  const { cartItems, recentSearches, addRecentSearch } = useLibrary()
  const { isDark, toggleTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const searchContainerRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 18)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowDropdown(false)
      }
    }

    window.addEventListener('mousedown', onClickOutside)
    return () => window.removeEventListener('mousedown', onClickOutside)
  }, [])

  useEffect(() => {
    // Intentional: close the drawer after any route transition.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMenuOpen(false)
  }, [location.pathname, location.search, location.hash])

  const filteredRecent = useMemo(() => {
    const cleaned = query.toLowerCase().trim()
    if (!cleaned) {
      return recentSearches.slice(0, 4)
    }
    return recentSearches
      .filter((item) => item.toLowerCase().includes(cleaned))
      .slice(0, 4)
  }, [query, recentSearches])

  const filteredCategories = useMemo(() => {
    const cleaned = query.toLowerCase().trim()
    if (!cleaned) {
      return popularCategories.slice(0, 5)
    }
    return popularCategories
      .filter((item) => item.toLowerCase().includes(cleaned))
      .slice(0, 5)
  }, [query])

  const search = (rawValue) => {
    const term = rawValue.trim()
    if (!term) {
      return
    }
    addRecentSearch(term)
    navigate(`/catalog?query=${encodeURIComponent(term)}`)
    setShowDropdown(false)
    setQuery('')
  }

  const useSolidHeader = isScrolled || isMenuOpen || location.pathname !== '/'

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition duration-300',
        useSolidHeader
          ? 'border-b border-navy/10 bg-cream/90 backdrop-blur dark:border-cream/10 dark:bg-night/85'
          : 'bg-transparent',
      )}
    >
      <div className="section-shell">
        <div className="flex min-h-[76px] items-center gap-4">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-navy transition hover:text-terracotta dark:text-cream"
            aria-label="Go to homepage"
          >
            <BookOpenText className="size-6" />
            <span className="font-serif text-2xl font-semibold tracking-wide">
              Biblioteca
            </span>
          </Link>

          <div className="hidden flex-1 md:block" ref={searchContainerRef}>
            <div className="relative mx-auto max-w-xl">
              <Input
                icon={Search}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onFocus={() => setShowDropdown(true)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    search(query)
                  }
                }}
                placeholder="Search millions of books..."
                aria-label="Search books"
                className="pr-12 shadow-soft"
              />
              <button
                type="button"
                onClick={() => search(query)}
                className="absolute right-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-navy/70 hover:bg-navy/10 dark:text-cream/80 dark:hover:bg-white/10"
                aria-label="Submit search"
              >
                <Search className="size-4" />
              </button>

              <AnimatePresence>
                {showDropdown ? (
                <Motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="surface-card absolute left-0 right-0 top-[calc(100%+8px)] z-[60] p-4"
                  >
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-navy/55 dark:text-cream/55">
                        Recent Searches
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {filteredRecent.map((item) => (
                          <button
                            key={item}
                            type="button"
                            className="rounded-full bg-navy/8 px-3 py-1.5 text-xs font-medium hover:bg-navy/15 dark:bg-cream/10 dark:hover:bg-cream/20"
                            onClick={() => search(item)}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-navy/55 dark:text-cream/55">
                        Popular Categories
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {filteredCategories.map((item) => (
                          <button
                            key={item}
                            type="button"
                            className="rounded-xl bg-sage/15 px-3 py-2 text-left font-medium hover:bg-sage/30 dark:bg-sage/25"
                            onClick={() => search(item)}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                </Motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              aria-label="Toggle dark mode"
              onClick={toggleTheme}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-navy hover:bg-navy/10 dark:text-cream dark:hover:bg-white/10"
            >
              {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </button>

            <Button
              as={Link}
              to="/account"
              variant="ghost"
              className="min-h-11 min-w-11 rounded-full px-3"
              aria-label="Open account"
            >
              <UserRound className="size-5" />
            </Button>

            <Button
              as={Link}
              to="/account"
              variant="ghost"
              className="relative min-h-11 min-w-11 rounded-full px-3"
              aria-label="Open cart"
            >
              <ShoppingBag className="size-5" />
              <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 animate-badge-pulse items-center justify-center rounded-full bg-terracotta px-1 text-[11px] font-bold text-white">
                {cartItems.length}
              </span>
            </Button>

            <button
              type="button"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-navy hover:bg-navy/10 dark:text-cream dark:hover:bg-white/10 lg:hidden"
              aria-label="Toggle menu"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        <nav
          className="hidden min-h-[52px] items-center justify-center border-t border-navy/10 text-sm dark:border-cream/10 lg:flex"
          aria-label="Secondary"
        >
          <div className="flex items-center gap-8">
            {secondaryLinks.map((link) =>
              link.to ? (
                <NavLink
                  key={link.label}
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      'rounded-full px-1 py-2 transition hover:text-terracotta',
                      isActive ? 'text-terracotta' : 'text-navy/75 dark:text-cream/80',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="rounded-full px-1 py-2 text-navy/75 transition hover:text-terracotta dark:text-cream/80"
                >
                  {link.label}
                </a>
              ),
            )}
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {isMenuOpen ? (
          <Motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="border-t border-navy/10 bg-cream/95 px-4 pb-4 pt-3 backdrop-blur dark:border-cream/10 dark:bg-night/95 lg:hidden"
            aria-label="Mobile menu"
          >
            <div className="section-shell px-0">
              <Input
                icon={Search}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    search(query)
                  }
                }}
                placeholder="Search millions of books..."
                aria-label="Search books"
                className="mb-4"
              />

              <div className="grid gap-2">
                {primaryLinks.map((link) => (
                  <NavLink
                    key={link.label}
                    to={link.to}
                    className={({ isActive }) =>
                      cn(
                        'rounded-2xl px-4 py-3 text-sm font-semibold',
                        isActive
                          ? 'bg-terracotta text-white'
                          : 'bg-white/70 text-navy dark:bg-nightSurface dark:text-cream',
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                {secondaryLinks.map((link) =>
                  link.to ? (
                    <NavLink
                      key={link.label}
                      to={link.to}
                      className={({ isActive }) =>
                        cn(
                          'rounded-2xl px-4 py-3 text-sm font-semibold',
                          isActive
                            ? 'bg-terracotta text-white'
                            : 'bg-white/70 text-navy dark:bg-nightSurface dark:text-cream',
                        )
                      }
                    >
                      {link.label}
                    </NavLink>
                  ) : (
                    <a
                      key={link.label}
                      href={link.href}
                      className="rounded-2xl bg-white/70 px-4 py-3 text-sm font-semibold text-navy dark:bg-nightSurface dark:text-cream"
                    >
                      {link.label}
                    </a>
                  ),
                )}
              </div>
            </div>
          </Motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
