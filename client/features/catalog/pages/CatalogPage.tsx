import { BookTile } from '../components/BookTile'
import { Input } from '../../../shared/components/primitives/input'
import { Button } from '../../../shared/components/primitives/button'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal } from 'lucide-react'
import type { BookList } from '../../../shared/types'
import { api } from '../../../shared/lib/api'
import { Empty, ErrorState, Loading, PageHeading } from '../../../shared/components/ui'

export default function Catalog() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? params.get('query') ?? ''
  const [input, setInput] = useState(q)
  const query = new URLSearchParams(params)
  query.set('q', q)
  const books = useQuery({
    queryKey: ['books', query.toString()],
    queryFn: () => api<BookList>(`/books?${query}`),
  })
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    if (key !== 'page') next.delete('page')
    setParams(next)
  }
  return (
    <div className="container page">
      <PageHeading
        eyebrow="THE COLLECTION"
        title="Find your next good read"
        description="Explore titles, discover authors, and make a little room for curiosity."
      />
      <div className="catalog-controls">
        <form
          className="search-input"
          onSubmit={(event) => {
            event.preventDefault()
            update('q', input)
          }}
        >
          <Search size={19} />
          <Input
            aria-label="Search catalog"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Title, author, or ISBN"
          />
          <Button className="button secondary" type="submit">
            Search
          </Button>
        </form>
        <label className="select-label">
          <SlidersHorizontal size={17} />
          <span className="sr-only">Genre</span>
          <select
            value={params.get('genre') ?? ''}
            onChange={(event) => update('genre', event.target.value)}
          >
            <option value="">All genres</option>
            {books.data?.genres.map((genre) => (
              <option key={genre}>{genre}</option>
            ))}
          </select>
        </label>
        <label className="select-label">
          <span className="sr-only">Sort books</span>
          <select
            value={params.get('sort') ?? 'title'}
            onChange={(event) => update('sort', event.target.value)}
          >
            <option value="title">Title: A to Z</option>
            <option value="newest">Newest first</option>
          </select>
        </label>
      </div>
      <div className="catalog-summary">
        <span className="muted">
          {books.data ? `${books.data.total} titles in the collection` : 'Finding titles...'}
        </span>
        <label className="checkbox-label">
          <Input
            type="checkbox"
            checked={params.get('available') === 'true'}
            onChange={(event) => update('available', event.target.checked ? 'true' : '')}
          />
          Available copies only
        </label>
      </div>
      {books.isPending ? (
        <Loading />
      ) : books.error ? (
        <ErrorState
          error={books.error}
          retry={() => {
            void books.refetch()
          }}
        />
      ) : books.data.items.length ? (
        <>
          <div className="book-grid">
            {books.data.items.map((book) => (
              <BookTile key={book._id} book={book} />
            ))}
          </div>
          <div className="pagination">
            <Button
              className="button secondary"
              disabled={books.data.page <= 1}
              onClick={() => update('page', String(books.data.page - 1))}
            >
              Previous
            </Button>
            <span>
              Page {books.data.page} of {Math.max(1, books.data.pages)}
            </span>
            <Button
              className="button secondary"
              disabled={books.data.page >= books.data.pages}
              onClick={() => update('page', String(books.data.page + 1))}
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        <Empty title="No titles found">
          <p className="muted">Try a different search or clear your filters.</p>
          <Button
            className="button secondary"
            onClick={() => {
              setParams({})
              setInput('')
            }}
          >
            Clear search
          </Button>
        </Empty>
      )}
    </div>
  )
}
