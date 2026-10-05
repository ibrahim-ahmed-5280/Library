import { Facebook, Instagram, Linkedin, Send, Youtube } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { weeklyHours } from '../../data/mockData.js'
import Input from '../common/Input.jsx'

const socialLinks = [
  { label: 'Facebook', href: 'https://facebook.com', icon: Facebook },
  { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
  { label: 'YouTube', href: 'https://youtube.com', icon: Youtube },
]

function Footer() {
  const [email, setEmail] = useState('')
  const [signedUp, setSignedUp] = useState(false)

  const currentDay = useMemo(
    () => new Date().toLocaleDateString('en-US', { weekday: 'long' }),
    [],
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!email.trim()) {
      return
    }
    setSignedUp(true)
    setEmail('')
  }

  return (
    <footer
      id="contact"
      className="mt-20 border-t border-navy/10 bg-white py-14 dark:border-cream/10 dark:bg-black"
    >
      <div className="section-shell">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr_1fr_1.2fr]">
          <div>
            <h2 className="text-2xl font-semibold">About Biblioteca</h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-navy/75 dark:text-cream/75">
              Biblioteca is a public-first library platform built around curiosity,
              equity, and lifelong learning. We connect neighborhoods with stories,
              research, and shared spaces.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Resources</h3>
            <ul className="mt-3 space-y-2 text-sm text-navy/75 dark:text-cream/75">
              <li>
                <Link className="hover:text-terracotta" to="/catalog">
                  Catalog Search
                </Link>
              </li>
              <li>
                <a className="hover:text-terracotta" href="/#membership">
                  Membership Levels
                </a>
              </li>
              <li>
                <Link className="hover:text-terracotta" to="/events">
                  Events Calendar
                </Link>
              </li>
              <li>
                <a className="hover:text-terracotta" href="/#blog">
                  Reading Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Connect</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-navy/15 bg-white/70 text-navy transition hover:-translate-y-0.5 hover:bg-terracotta hover:text-white dark:border-cream/20 dark:bg-nightSurface dark:text-cream"
                  aria-label={label}
                >
                  <Icon className="size-[18px]" />
                </a>
              ))}
            </div>
          </div>

          <div className="surface-card p-4">
            <h3 className="text-lg font-semibold">Hours</h3>
            <ul className="mt-3 space-y-1.5 text-sm">
              {weeklyHours.map((item) => {
                const active = item.day === currentDay
                return (
                  <li
                    key={item.day}
                    className={`flex items-center justify-between rounded-lg px-2 py-1.5 ${
                      active ? 'bg-terracotta/15 text-terracotta' : ''
                    }`}
                  >
                    <span className="font-medium">{item.day}</span>
                    <span className="text-xs">{item.hours}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <div className="mt-10 grid gap-4 border-t border-navy/10 pt-8 dark:border-cream/10 lg:grid-cols-[1fr_auto] lg:items-center">
          <form onSubmit={handleSubmit} className="max-w-xl">
            <p className="mb-2 text-sm font-semibold">Newsletter</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                type="email"
                value={email}
                placeholder="Enter your email for events and reading picks"
                onChange={(event) => setEmail(event.target.value)}
                aria-label="Newsletter email"
                className="h-11"
              />
              <button type="submit" className="btn-primary px-5">
                <Send className="size-4" />
                Subscribe
              </button>
            </div>
            {signedUp ? (
              <p className="mt-2 text-sm text-sage">
                Thank you. You are subscribed to Biblioteca updates.
              </p>
            ) : null}
          </form>

          <div className="text-sm text-navy/65 dark:text-cream/65">
            <p>Copyright 2026 Biblioteca Library Network.</p>
            <p>Accessibility: WCAG AA mindful design, keyboard-first navigation.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
