import { useEffect, useRef, useState } from 'react'
import { libraryStats } from '../../data/mockData.js'
import { useCountUp } from '../../hooks/useCountUp.js'

function CounterCard({ item, active }) {
  const count = useCountUp(item.value, active)
  const formatted = count.toLocaleString()

  return (
    <article className="surface-card p-5 text-center">
      <p className="text-3xl font-semibold sm:text-4xl">
        {formatted}
        {item.suffix}
      </p>
      <p className="mt-2 text-sm font-medium uppercase tracking-wider text-navy/65 dark:text-cream/65">
        {item.label}
      </p>
    </article>
  )
}

function StatsSection() {
  const sectionRef = useRef(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="section-shell mt-12">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {libraryStats.map((item) => (
          <CounterCard key={item.label} item={item} active={active} />
        ))}
      </div>
    </section>
  )
}

export default StatsSection
