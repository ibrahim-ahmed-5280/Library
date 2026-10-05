import { useLibrarySettings, defaultLibrary } from '../hooks/useLibrarySettings'
import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { useState } from 'react'

export default function Brand() {
  const library = useLibrarySettings()
  const [failedLogo, setFailedLogo] = useState<string | null>(null)
  const name = library.data?.name ?? defaultLibrary.name
  const logoId = library.data?.logoId
  return (
    <Link
      to="/"
      className={`brand${library.data?.showName === false ? ' brand-logo-only' : ''}`}
      aria-label={name}
    >
      <span className="brand-mark">
        {logoId && failedLogo !== logoId ? (
          <img src={`/api/covers/${logoId}`} alt="" onError={() => setFailedLogo(logoId)} />
        ) : (
          <BookOpen size={23} />
        )}
      </span>
      {library.data?.showName !== false && <span>{name}</span>}
    </Link>
  )
}
