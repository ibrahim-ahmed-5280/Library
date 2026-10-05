import { motion as Motion } from 'framer-motion'
import { BookHeart, CircleHelp, DoorOpen, HandHeart } from 'lucide-react'
import { quickActions } from '../../data/mockData.js'

const actionIcons = [DoorOpen, CircleHelp, BookHeart, HandHeart]

function QuickActionsBar() {
  return (
    <section className="section-shell mt-12">
      <div className="surface-card p-4">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-navy/65 dark:text-cream/65">
          Quick Actions
        </p>

        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-max gap-3 sm:grid sm:min-w-0 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, index) => {
              const Icon = actionIcons[index]
              return (
                <Motion.button
                  key={action}
                  type="button"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.28, delay: index * 0.06 }}
                  className="chip-action min-w-[185px] gap-2 bg-white/70 dark:bg-nightSurface"
                  aria-label={action}
                >
                  <Icon className="size-[18px]" />
                  {action}
                </Motion.button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default QuickActionsBar
