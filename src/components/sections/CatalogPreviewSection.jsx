import { motion as Motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BookCard from '../books/BookCard.jsx'
import { BookCardSkeleton } from '../common/Skeleton.jsx'

function CatalogPreviewSection({ books }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 900)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <section id="catalog" className="section-shell mt-20">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h2 className="section-title">Popular Books This Week</h2>
          <p className="mt-1 text-sm text-navy/72 dark:text-cream/72">
            Hand-picked by our librarians and most borrowed across all branches.
          </p>
        </div>
        <Link
          className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-terracotta hover:bg-terracotta/10"
          to="/catalog"
        >
          View All
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="overflow-x-auto pb-4">
        <Motion.div
          className="flex min-w-max gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.08 },
            },
          }}
        >
          {loading
            ? [...Array(6)].map((_, index) => <BookCardSkeleton key={`skeleton-${index}`} />)
            : books.map((book) => (
                <Motion.div
                  key={book.id}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <BookCard book={book} compact />
                </Motion.div>
              ))}
        </Motion.div>
      </div>
    </section>
  )
}

export default CatalogPreviewSection
