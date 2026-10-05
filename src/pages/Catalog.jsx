import { Filter, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import BookCard from '../components/books/BookCard.jsx'
import FilterSidebar from '../components/catalog/FilterSidebar.jsx'
import BookLoader from '../components/common/BookLoader.jsx'
import { BookCardSkeleton } from '../components/common/Skeleton.jsx'
import Input from '../components/common/Input.jsx'
import { useLibrary } from '../context/LibraryContext.jsx'

function Catalog() {
  const { books, addRecentSearch } = useLibrary()
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    genres: [],
    authors: [],
    years: [],
    statuses: [],
  })
  const [openGroups, setOpenGroups] = useState({
    genre: true,
    author: true,
    year: true,
    availability: true,
  })
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const searchQuery = searchParams.get('query') ?? ''
  const sortType = searchParams.get('sort') ?? 'default'
  const [searchInput, setSearchInput] = useState(searchQuery)

  useEffect(() => {
    setSearchInput(searchQuery)
  }, [searchQuery])

  useEffect(() => {
    setLoading(true)
    const timer = window.setTimeout(() => setLoading(false), 500)
    return () => window.clearTimeout(timer)
  }, [searchQuery, sortType, filters])

  const filteredBooks = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    let result = books.filter((book) => {
      const queryMatch =
        !normalizedQuery ||
        book.title.toLowerCase().includes(normalizedQuery) ||
        book.author.toLowerCase().includes(normalizedQuery) ||
        book.genre.toLowerCase().includes(normalizedQuery)

      const genreMatch =
        filters.genres.length === 0 || filters.genres.includes(book.genre)
      const authorMatch =
        filters.authors.length === 0 || filters.authors.includes(book.author)
      const yearMatch =
        filters.years.length === 0 || filters.years.includes(book.year)
      const statusMatch =
        filters.statuses.length === 0 || filters.statuses.includes(book.status)

      return queryMatch && genreMatch && authorMatch && yearMatch && statusMatch
    })

    if (sortType === 'rating') {
      result = result.sort((a, b) => b.rating - a.rating)
    } else if (sortType === 'new') {
      result = result.sort((a, b) => b.year - a.year)
    } else {
      result = result.sort((a, b) => a.title.localeCompare(b.title))
    }

    return result
  }, [books, searchQuery, sortType, filters])

  const setQueryParam = (value) => {
    const next = new URLSearchParams(searchParams)
    const trimmed = value.trim()
    if (trimmed) {
      next.set('query', trimmed)
      addRecentSearch(trimmed)
    } else {
      next.delete('query')
    }
    setSearchParams(next)
  }

  const setSortParam = (value) => {
    const next = new URLSearchParams(searchParams)
    if (value === 'default') {
      next.delete('sort')
    } else {
      next.set('sort', value)
    }
    setSearchParams(next)
  }

  const toggleGroup = (groupName) => {
    setOpenGroups((prev) => ({ ...prev, [groupName]: !prev[groupName] }))
  }

  return (
    <section className="section-shell pb-6">
      <header className="mb-6 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-terracotta">
          Catalog
        </p>
        <h1 className="section-title">Find your next book, article, or audiobook</h1>
        <p className="max-w-2xl text-sm text-navy/72 dark:text-cream/72">
          Search our full collection and refine results by genre, author,
          publication year, and availability.
        </p>
      </header>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <form
          className="flex-1"
          onSubmit={(event) => {
            event.preventDefault()
            setQueryParam(searchInput)
          }}
        >
          <Input
            icon={Search}
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search books, authors, genres..."
            aria-label="Search catalog"
          />
        </form>

        <div className="flex gap-2">
          <button
            type="button"
            className="btn-outline px-4 lg:hidden"
            onClick={() => setMobileFiltersOpen((prev) => !prev)}
          >
            <Filter className="size-4" />
            Filters
          </button>

          <label className="input-shell flex min-h-11 items-center gap-2 px-3 text-sm sm:w-52">
            Sort by
            <select
              className="w-full bg-transparent text-sm outline-none"
              value={sortType}
              onChange={(event) => setSortParam(event.target.value)}
            >
              <option value="default">Title</option>
              <option value="new">Newest</option>
              <option value="rating">Top Rated</option>
            </select>
          </label>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className={`lg:block ${mobileFiltersOpen ? 'block' : 'hidden'}`}>
          <FilterSidebar
            books={books}
            filters={filters}
            setFilters={setFilters}
            openGroups={openGroups}
            toggleGroup={toggleGroup}
          />
        </div>

        <div>
          <p className="mb-4 text-sm font-medium text-navy/70 dark:text-cream/70">
            Showing {filteredBooks.length} books
          </p>

          {loading ? (
            <div>
              <BookLoader label="Refreshing catalog..." />
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <BookCardSkeleton key={`catalog-skeleton-${index}`} />
                ))}
              </div>
            </div>
          ) : filteredBooks.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="surface-card p-8 text-center">
              <h2 className="text-2xl font-semibold">No books matched your filters.</h2>
              <p className="mt-2 text-sm text-navy/70 dark:text-cream/70">
                Try removing some filters or searching with fewer keywords.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Catalog
