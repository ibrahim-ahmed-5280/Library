import { motion as Motion } from 'framer-motion'
import { Bookmark, Eye, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLibrary } from '../../context/LibraryContext.jsx'
import { availabilityMeta } from '../../data/mockData.js'
import { cn } from '../../utils/cn.js'
import Button from '../common/Button.jsx'
import Card from '../common/Card.jsx'
import RatingStars from './RatingStars.jsx'

function BookCard({ book, className, compact = false }) {
  const { addToCart, toggleSaved, savedItems, openQuickView } = useLibrary()
  const availability = availabilityMeta[book.status]
  const isSaved = savedItems.includes(book.id)
  const coverGradient =
    book.status === 'checked_out'
      ? 'linear-gradient(145deg, #000000 0%, #04275c 100%)'
      : book.status === 'limited'
        ? 'linear-gradient(145deg, #04275c 0%, #45beff 100%)'
        : 'linear-gradient(145deg, #45beff 0%, #04275c 100%)'

  return (
    <Motion.article
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 240, damping: 20 }}
      className={cn('group', compact ? 'min-w-[240px] sm:min-w-[252px]' : '', className)}
    >
      <Card className="relative overflow-hidden p-4 hover:shadow-lift">
        <div
          className="relative h-44 overflow-hidden rounded-2xl p-4 text-cream"
          style={{ background: coverGradient }}
        >
          <div className="absolute inset-0 opacity-35 pattern-dots" aria-hidden="true" />
          <p className="relative text-lg font-semibold">{book.title}</p>
          <p className="relative mt-1 text-sm text-cream/80">{book.author}</p>
          <span
            className={cn(
              'absolute left-3 top-3 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
              availability.badge,
            )}
          >
            {availability.label}
          </span>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <Link
              to={`/book/${book.id}`}
              className="line-clamp-1 text-lg font-semibold text-navy transition hover:text-terracotta dark:text-cream"
            >
              {book.title}
            </Link>
            <p className="text-sm text-navy/70 dark:text-cream/70">{book.author}</p>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-2 text-navy/70 dark:text-cream/70">
              <span className={cn('size-2.5 rounded-full', availability.dot)} />
              {availability.label}
            </span>
            <RatingStars rating={book.rating} />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className={cn(
                'btn-ghost min-h-10 flex-1 px-3 py-2 text-xs',
                isSaved ? 'border border-terracotta/40 text-terracotta' : '',
              )}
              onClick={() => toggleSaved(book.id)}
              aria-label={isSaved ? `Remove ${book.title} from saved` : `Save ${book.title}`}
            >
              <Bookmark className={cn('size-4', isSaved ? 'fill-terracotta' : '')} />
              {isSaved ? 'Saved' : 'Save'}
            </button>

            <button
              type="button"
              className="btn-outline min-h-10 flex-1 px-3 py-2 text-xs"
              onClick={() => addToCart(book.id)}
              aria-label={`Borrow ${book.title}`}
            >
              <ShoppingBag className="size-4" />
              Borrow
            </button>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 hidden items-end justify-center bg-gradient-to-t from-navy/60 via-navy/20 to-transparent p-4 opacity-0 transition duration-300 group-hover:opacity-100 group-focus-within:opacity-100 sm:flex">
          <div className="pointer-events-auto flex gap-2">
            <Button
              variant="outline"
              className="min-h-10 bg-white/90 px-3 py-2 text-xs backdrop-blur dark:bg-night/80"
              onClick={() => openQuickView(book)}
            >
              <Eye className="size-4" />
              Quick View
            </Button>
            <Button
              className="min-h-10 px-3 py-2 text-xs"
              onClick={() => addToCart(book.id)}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </Card>
    </Motion.article>
  )
}

export default BookCard
