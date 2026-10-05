import { BookCover } from './BookCover'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Book } from '../../../shared/types'

export function BookTile({ book }: { book: Book }) {
  return (
    <article className="book-tile">
      <Link to={`/book/${book._id}`} aria-label={`View ${book.title}`}>
        <BookCover book={book} />
      </Link>
      <div className="book-meta">
        <span className="eyebrow">{book.genre}</span>
        <h3>
          <Link to={`/book/${book._id}`}>{book.title}</Link>
        </h3>
        <p className="muted">{book.author}</p>
        <div className="book-meta-bottom">
          <span className={`availability ${book.copies?.available ? 'available' : ''}`}>
            {book.copies?.available
              ? `${book.copies.available} ${book.copies.available === 1 ? 'copy' : 'copies'} available`
              : 'No copies available'}
          </span>
          <Link to={`/book/${book._id}`} aria-label={`Details for ${book.title}`}>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </article>
  )
}
