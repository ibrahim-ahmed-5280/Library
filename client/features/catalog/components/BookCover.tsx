import { useState } from 'react'
import type { Book } from '../../../shared/types'

export function BookCover({ book, large = false }: { book: Book; large?: boolean }) {
  const [failedCover, setFailedCover] = useState<string | null>(null)
  if (book.coverId && failedCover !== book.coverId)
    return (
      <div className={`book-cover uploaded-cover ${large ? 'large' : ''}`}>
        <img
          src={`/api/covers/${book.coverId}`}
          alt={`Cover of ${book.title}`}
          loading="lazy"
          onError={() => setFailedCover(book.coverId!)}
        />
      </div>
    )
  const variants = ['forest', 'sand', 'blue', 'rust']
  const index = [...book.title].reduce((sum, char) => sum + char.charCodeAt(0), 0) % variants.length
  return (
    <div className={`book-cover ${variants[index]} ${large ? 'large' : ''}`}>
      <span className="cover-author">{book.author}</span>
      <strong>{book.title}</strong>
      <span className="cover-bottom">
        {book.genre}
        <span>Library collection</span>
      </span>
    </div>
  )
}
