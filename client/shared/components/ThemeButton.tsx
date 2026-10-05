import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function ThemeButton() {
  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem('biblioteca-theme')
      return saved ? saved === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches
    } catch {
      return false
    }
  })
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    try {
      localStorage.setItem('biblioteca-theme', dark ? 'dark' : 'light')
    } catch {
      /* Theme still works when storage is unavailable. */
    }
  }, [dark])
  return (
    <button
      className="icon-button"
      aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`}
      onClick={() => setDark(!dark)}
    >
      {dark ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  )
}
