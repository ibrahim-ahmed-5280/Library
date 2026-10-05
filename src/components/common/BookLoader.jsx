function BookLoader({ label = 'Loading library content...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10" aria-live="polite">
      <div
        className="relative h-11 w-14 rounded-md bg-navy/10 p-1 dark:bg-cream/10"
        role="status"
        aria-label={label}
      >
        <span className="absolute inset-y-1 left-1 w-1/2 origin-right rounded-l-sm bg-terracotta/85 animate-book-flip" />
        <span className="absolute inset-y-1 right-1 w-1/2 rounded-r-sm bg-sage" />
      </div>
      <p className="text-sm text-navy/70 dark:text-cream/70">{label}</p>
    </div>
  )
}

export default BookLoader
