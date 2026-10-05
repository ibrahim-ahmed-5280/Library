import { ArrowRightLeft, DatabaseZap, Medal } from 'lucide-react'
import { membershipPerks } from '../../data/mockData.js'
import Card from '../common/Card.jsx'

const icons = [Medal, DatabaseZap, ArrowRightLeft]

function MembershipSection() {
  return (
    <section id="membership" className="mt-20">
      <div className="section-shell">
        <div className="wave-divider h-10 w-full" aria-hidden="true" />
      </div>

      <div className="section-shell mt-8">
        <h2 className="section-title">Membership Perks and Research Access</h2>
        <p className="mt-2 max-w-2xl text-sm text-navy/72 dark:text-cream/72">
          Choose the level that fits your learning goals. Every tier supports
          digital resources, inter-library loans, and personalized librarian help.
        </p>

        <div className="mt-7 space-y-4">
          {membershipPerks.map((perk, index) => {
            const Icon = icons[index]
            const odd = index % 2 !== 0
            return (
              <Card
                key={perk.title}
                className={`grid items-center gap-4 p-5 sm:grid-cols-[auto_1fr] ${
                  odd ? 'bg-sage/12 dark:bg-sage/15' : ''
                }`}
              >
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-terracotta/12 text-terracotta">
                  <Icon className="size-6" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-sage">
                    {perk.subtitle}
                  </p>
                  <h3 className="text-2xl font-semibold">{perk.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-navy/75 dark:text-cream/75">
                    {perk.body}
                  </p>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default MembershipSection
