import { BookOpen, Bookmark, Calendar, LibraryBig, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLibrary } from '../../context/LibraryContext.jsx'
import { availabilityMeta } from '../../data/mockData.js'
import Badge from '../common/Badge.jsx'
import Button from '../common/Button.jsx'
import Modal from '../common/Modal.jsx'
import RatingStars from './RatingStars.jsx'

function QuickViewModal() {
  const { quickViewBook, closeQuickView, addToCart, toggleSaved, savedItems } =
    useLibrary()

  if (!quickViewBook) {
    return <Modal open={false} onClose={closeQuickView} title="Book details" />
  }

  const availability = availabilityMeta[quickViewBook.status]
  const isSaved = savedItems.includes(quickViewBook.id)
  const coverGradient =
    quickViewBook.status === 'checked_out'
      ? 'linear-gradient(145deg, #000000 0%, #04275c 100%)'
      : quickViewBook.status === 'limited'
        ? 'linear-gradient(145deg, #04275c 0%, #45beff 100%)'
        : 'linear-gradient(145deg, #45beff 0%, #04275c 100%)'

  return (
    <Modal open={Boolean(quickViewBook)} onClose={closeQuickView} title={quickViewBook.title}>
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <div
          className="relative h-72 rounded-2xl p-5 text-cream"
          style={{ background: coverGradient }}
        >
          <div className="absolute inset-0 opacity-35 pattern-dots" aria-hidden="true" />
          <p className="relative text-2xl font-semibold">{quickViewBook.title}</p>
          <p className="relative mt-2 text-cream/80">{quickViewBook.author}</p>
        </div>

        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="terracotta">{quickViewBook.genre}</Badge>
            <Badge variant="sage">{availability.label}</Badge>
            {quickViewBook.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>

          <RatingStars rating={quickViewBook.rating} />

          <p className="text-sm leading-relaxed text-navy/80 dark:text-cream/85">
            {quickViewBook.description}
          </p>

          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="surface-card p-3">
              <dt className="mb-1 text-navy/60 dark:text-cream/65">
                <Calendar className="mr-2 inline size-4" />
                Publication Year
              </dt>
              <dd className="font-semibold">{quickViewBook.year}</dd>
            </div>
            <div className="surface-card p-3">
              <dt className="mb-1 text-navy/60 dark:text-cream/65">
                <BookOpen className="mr-2 inline size-4" />
                Page Count
              </dt>
              <dd className="font-semibold">{quickViewBook.pages}</dd>
            </div>
          </dl>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Reader Reviews</h3>
            <div className="space-y-2">
              {quickViewBook.reviews.map((review) => (
                <article key={review.name} className="surface-card p-3">
                  <p className="text-sm font-semibold">{review.name}</p>
                  <p className="mt-1 text-sm text-navy/75 dark:text-cream/75">
                    {review.comment}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => addToCart(quickViewBook.id)}>
              <ShoppingBag className="size-4" />
              Add to Cart
            </Button>
            <Button variant="outline" onClick={() => toggleSaved(quickViewBook.id)}>
              <Bookmark className={`size-4 ${isSaved ? 'fill-terracotta' : ''}`} />
              {isSaved ? 'Saved' : 'Save'}
            </Button>
            <Button
              as={Link}
              to={`/book/${quickViewBook.id}`}
              variant="ghost"
              onClick={closeQuickView}
            >
              <LibraryBig className="size-4" />
              Full Details
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default QuickViewModal
