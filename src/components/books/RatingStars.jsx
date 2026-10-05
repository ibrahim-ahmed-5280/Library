import { Star } from 'lucide-react'

function RatingStars({ rating, className }) {
  const filledStars = Math.round(rating)

  return (
    <div className={`flex items-center gap-1 ${className ?? ''}`} aria-label={`Rated ${rating} out of 5`}>
      {[...Array(5)].map((_, index) => (
        <Star
          key={`star-${index + 1}`}
          className={`size-3.5 ${
            index < filledStars
              ? 'fill-terracotta text-terracotta'
              : 'text-navy/25 dark:text-cream/25'
          }`}
          aria-hidden="true"
        />
      ))}
      <span className="ml-1 text-xs font-medium text-navy/70 dark:text-cream/70">{rating.toFixed(1)}</span>
    </div>
  )
}

export default RatingStars
