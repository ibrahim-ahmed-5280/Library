import { motion as Motion } from 'framer-motion'
import { ArrowRight, CreditCard } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../common/Button.jsx'

function HeroSection() {
  return (
    <section id="home" className="section-shell pt-8">
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <Motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45 }}
          className="space-y-6"
        >
          <p className="inline-flex rounded-full border border-terracotta/30 bg-terracotta/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-terracotta">
            Community Library Platform
          </p>

          <h1 className="text-balance text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            Discover stories that change everything.
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-navy/78 dark:text-cream/82 sm:text-lg">
            Explore an inviting, modern library experience with thoughtful spaces,
            expert support, and millions of books curated for every stage of life.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button as={Link} to="/catalog">
              Explore Catalog
              <ArrowRight className="size-4" />
            </Button>
            <Button as={Link} to="/account" variant="outline">
              <CreditCard className="size-4" />
              Get a Library Card
            </Button>
          </div>

          <blockquote className="surface-card max-w-xl border-l-4 border-terracotta p-4 text-sm italic text-navy/75 dark:text-cream/75">
            We read to know we are not alone.
          </blockquote>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="relative mx-auto w-full max-w-[520px]"
        >
          <div className="surface-card relative h-[390px] overflow-hidden p-5 sm:h-[430px]">
            <div className="absolute -right-12 -top-8 h-52 w-52 rounded-full bg-sage/35 blur-2xl" />
            <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-terracotta/25 blur-2xl" />

            <div className="absolute left-8 top-12 h-44 w-28 -rotate-6 rounded-xl bg-gradient-to-br from-[#04275c] to-[#45beff] p-3 text-cream shadow-soft">
              <p className="font-serif text-lg">Quiet Mornings</p>
              <p className="mt-20 text-xs opacity-80">Fiction Shelf</p>
            </div>

            <div className="absolute left-40 top-10 h-48 w-28 rotate-6 rounded-xl bg-gradient-to-br from-[#45beff] to-[#04275c] p-3 text-cream shadow-soft">
              <p className="font-serif text-lg">Open Window</p>
              <p className="mt-24 text-xs opacity-80">Poetry</p>
            </div>

            <div className="absolute right-8 top-24 h-44 w-28 -rotate-2 rounded-xl bg-gradient-to-br from-[#000000] to-[#04275c] p-3 text-cream shadow-soft">
              <p className="font-serif text-lg">City Atlas</p>
              <p className="mt-20 text-xs opacity-80">Nonfiction</p>
            </div>

            <div className="absolute bottom-14 left-14 h-24 w-24 rounded-full border-4 border-white/80 bg-gradient-to-b from-[#ffffff] to-[#45beff] shadow-soft">
              <span className="absolute left-4 top-2 h-2.5 w-10 rounded-full bg-white/80" />
              <span className="absolute right-5 top-4 h-1.5 w-8 rounded-full bg-white/70" />
            </div>

            <svg
              viewBox="0 0 180 80"
              className="absolute bottom-10 right-8 h-20 w-40 text-navy/65 dark:text-cream/70"
              aria-hidden="true"
            >
              <g fill="none" stroke="currentColor" strokeWidth="4">
                <ellipse cx="52" cy="40" rx="34" ry="24" />
                <ellipse cx="128" cy="40" rx="34" ry="24" />
                <path d="M86 40h8" />
              </g>
            </svg>
          </div>
        </Motion.div>
      </div>
    </section>
  )
}

export default HeroSection
