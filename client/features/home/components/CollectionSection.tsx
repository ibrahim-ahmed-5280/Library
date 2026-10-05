import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Book } from '../../../shared/types'
import { BookTile } from '../../catalog/components/BookTile'
import { Empty, ErrorState, Loading } from '../../../shared/components/ui'

export default function CollectionSection({
  books,
  loading,
  error,
  onRetry,
}: {
  books: Book[]
  loading: boolean
  error: Error | null
  onRetry: () => void
}) {
  return (
    <section className="reader-collection" aria-labelledby="collection-title">
      <div className="reader-section-heading">
        <div>
          <p className="eyebrow">GOOD READS START HERE</p>
          <h2 id="collection-title">Something for your reading list</h2>
          <p className="muted">Explore some of the newest published titles in our collection.</p>
        </div>
        <Link to="/catalog" className="button secondary">
          Browse all books <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorState error={error} retry={onRetry} />
      ) : books.length ? (
        <div className="book-grid">
          {books.map((book) => (
            <BookTile key={book._id} book={book} />
          ))}
        </div>
      ) : (
        <Empty title="A new collection is taking shape">
          <p className="muted">Titles will appear here as the library adds them to the catalog.</p>
          <Link to="/help" className="text-link">
            Learn how borrowing works
          </Link>
        </Empty>
      )}
    </section>
  )
}
