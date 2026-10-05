import { ArrowLeft, Bookmark, Calendar, Clock3, ShoppingBag } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import RatingStars from '../components/books/RatingStars.jsx'
import Badge from '../components/common/Badge.jsx'
import Button from '../components/common/Button.jsx'
import { useLibrary } from '../context/LibraryContext.jsx'
import { availabilityMeta, getBookById } from '../data/mockData.js'

function BookDetails() {
  const { bookId } = useParams()
  const { addToCart, toggleSaved, savedItems } = useLibrary()
  const book = getBookById(bookId)

  if (!book) {
    return (
      <section className="section-shell">
        <div className="surface-card p-8 text-center">
          <h1 className="text-3xl font-semibold">Book not found</h1>
          <p className="mt-2 text-sm text-navy/70 dark:text-cream/70">
            The requested title is unavailable or the link is invalid.
          </p>
          <Button as={Link} to="/catalog" className="mt-4">
            <ArrowLeft className="size-4" />
            Back to Catalog
          </Button>
        </div>
      </section>
    )
  }

  const availability = availabilityMeta[book.status]
  const isSaved = savedItems.includes(book.id)
  const coverGradient =
    book.status === 'checked_out'
      ? 'linear-gradient(145deg, #000000 0%, #04275c 100%)'
      : book.status === 'limited'
        ? 'linear-gradient(145deg, #04275c 0%, #45beff 100%)'
        : 'linear-gradient(145deg, #45beff 0%, #04275c 100%)'

  return (
    <section className="section-shell pb-4">
      <Button as={Link} to="/catalog" variant="ghost" className="mb-4 px-2">
        <ArrowLeft className="size-4" />
        Back to catalog
      </Button>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div
          className="surface-card h-96 p-5 text-cream"
          style={{ background: coverGradient }}
        >
          <p className="font-serif text-3xl font-semibold">{book.title}</p>
          <p className="mt-2 text-base text-cream/80">{book.author}</p>
          <p className="mt-40 text-sm text-cream/75">{book.quote}</p>
        </div>

        <article className="surface-card p-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="terracotta">{book.genre}</Badge>
            <Badge variant="sage">{availability.label}</Badge>
            {book.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>

          <h1 className="mt-4 text-4xl font-semibold">{book.title}</h1>
          <p className="mt-1 text-lg text-navy/70 dark:text-cream/72">{book.author}</p>
          <RatingStars rating={book.rating} className="mt-3" />

          <p className="mt-4 leading-relaxed text-navy/80 dark:text-cream/80">
            {book.description}
          </p>

          <div className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-2xl bg-navy/8 p-3 dark:bg-white/10">
              <p className="font-medium text-navy/65 dark:text-cream/70">
                <Calendar className="mr-1 inline size-4" />
                Published
              </p>
              <p className="mt-1 text-lg font-semibold">{book.year}</p>
            </div>
            <div className="rounded-2xl bg-navy/8 p-3 dark:bg-white/10">
              <p className="font-medium text-navy/65 dark:text-cream/70">
                <Clock3 className="mr-1 inline size-4" />
                Pages
              </p>
              <p className="mt-1 text-lg font-semibold">{book.pages}</p>
            </div>
            <div className="rounded-2xl bg-navy/8 p-3 dark:bg-white/10">
              <p className="font-medium text-navy/65 dark:text-cream/70">Availability</p>
              <p className="mt-1 text-lg font-semibold">{availability.label}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button onClick={() => addToCart(book.id)}>
              <ShoppingBag className="size-4" />
              Borrow Now
            </Button>
            <Button variant="outline" onClick={() => toggleSaved(book.id)}>
              <Bookmark className={`size-4 ${isSaved ? 'fill-terracotta' : ''}`} />
              {isSaved ? 'Saved' : 'Save for Later'}
            </Button>
          </div>
        </article>
      </div>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold">Reviews</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {book.reviews.map((review) => (
            <article key={review.name} className="surface-card p-4">
              <h3 className="text-lg font-semibold">{review.name}</h3>
              <p className="mt-2 text-sm text-navy/78 dark:text-cream/78">
                {review.comment}
              </p>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}

export default BookDetails
