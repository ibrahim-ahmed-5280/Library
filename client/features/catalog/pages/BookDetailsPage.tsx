import { useAction } from '../../../shared/hooks/useAction'
import { BookCover } from '../components/BookCover'
import { Button } from '../../../shared/components/primitives/button'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Bookmark } from 'lucide-react'
import type { Book } from '../../../shared/types'
import { api } from '../../../shared/lib/api'
import { useAuth } from '../../auth/providers/AuthProvider'
import { ErrorState, Loading, MutationFeedback, Status } from '../../../shared/components/ui'

export function BookDetails() {
  const { bookId } = useParams()
  const { user } = useAuth()
  const book = useQuery({
    queryKey: ['book', bookId],
    queryFn: () => api<Book>(`/books/${bookId}`),
  })
  const saved = useQuery({
    queryKey: ['saved'],
    queryFn: () => api<Book[]>('/me/saved'),
    enabled: !!user,
  })
  const holds = useQuery({
    queryKey: ['reservations', 'mine'],
    queryFn: () => api<{ book: Book; status: string }[]>('/reservations?scope=mine'),
    enabled: !!user,
  })
  const isSaved = saved.data?.some((item) => item._id === bookId),
    reserved = holds.data?.some((item) => item.book?._id === bookId && item.status === 'waiting')
  const save = useAction(`/me/saved/${bookId}`, isSaved ? 'DELETE' : 'PUT')
  const reserve = useAction('/reservations')
  if (book.isPending) return <Loading />
  if (book.error)
    return (
      <div className="container page">
        <ErrorState error={book.error} />
        <Link to="/catalog">Back to catalog</Link>
      </div>
    )
  return (
    <div className="container page">
      <Link className="text-link back-link" to="/catalog">
        <ArrowLeft size={17} />
        Back to catalog
      </Link>
      <div className="book-details">
        <BookCover book={book.data} large />
        <div>
          <p className="eyebrow">{book.data.genre}</p>
          <h1>{book.data.title}</h1>
          <p className="book-author">by {book.data.author}</p>
          <Status value={book.data.copies?.available ? 'available' : 'on_loan'} />
          <p className="book-description">
            {book.data.description || 'Ask your librarian for more information about this title.'}
          </p>
          <dl className="book-facts">
            <div>
              <dt>Published</dt>
              <dd>{book.data.year}</dd>
            </div>
            <div>
              <dt>ISBN</dt>
              <dd>{book.data.isbn}</dd>
            </div>
            <div>
              <dt>Copies available</dt>
              <dd>
                {book.data.copies?.available ?? 0} of {book.data.copies?.total ?? 0}
              </dd>
            </div>
          </dl>
          {user ? (
            <div className="button-row">
              <Button
                className="button"
                disabled={reserve.isPending || reserved}
                onClick={() => reserve.mutate({ bookId })}
              >
                {reserved
                  ? 'Reservation placed'
                  : reserve.isPending
                    ? 'Reserving...'
                    : 'Reserve this title'}
              </Button>
              <Button
                className="button secondary"
                disabled={save.isPending}
                onClick={() => save.mutate(undefined)}
              >
                <Bookmark size={17} fill={isSaved ? 'currentColor' : 'none'} />
                {isSaved ? 'Remove from saved' : 'Save for later'}
              </Button>
            </div>
          ) : (
            <Link className="button" to="/login">
              Sign in to save or reserve
            </Link>
          )}
          <MutationFeedback
            error={reserve.error || save.error}
            success={reserve.isSuccess}
            message="Your reservation is recorded. Track it in My library."
          />
          <p className="muted detail-note">
            A reservation joins the collection queue. Library staff issue the physical copy when you
            collect it.
          </p>
          <h3>Where to find it</h3>
          <div className="copy-locations">
            {book.data.inventory?.length ? (
              book.data.inventory.map((copy) => (
                <div key={copy._id}>
                  <span>{copy.shelf}</span>
                  <Status value={copy.status} />
                </div>
              ))
            ) : (
              <p className="muted">There are no circulating copies of this title yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
