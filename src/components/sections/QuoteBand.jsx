import { readingQuotes } from '../../data/mockData.js'

function QuoteBand() {
  return (
    <section id="blog" className="section-shell mt-16">
      <div className="surface-card pattern-dots overflow-hidden px-6 py-8 sm:px-8">
        <h2 className="text-2xl font-semibold">From the Reading Journal</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {readingQuotes.map((quote) => (
            <blockquote
              key={quote}
              className="rounded-2xl bg-white/85 p-4 text-sm italic leading-relaxed text-navy/78 dark:bg-night/45 dark:text-cream/80"
            >
              {quote}
            </blockquote>
          ))}
        </div>
        <p className="mt-4 text-xs uppercase tracking-[0.14em] text-navy/58 dark:text-cream/58">
          Visual direction: feature diverse readers across ages, cultures, and abilities.
        </p>
      </div>
    </section>
  )
}

export default QuoteBand
