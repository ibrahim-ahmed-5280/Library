import { motion as Motion } from 'framer-motion'
import {
  BookText,
  CalendarRange,
  Infinity as InfinityIcon,
  MonitorSmartphone,
} from 'lucide-react'
import { featureHighlights } from '../../data/mockData.js'
import Card from '../common/Card.jsx'

const iconMap = [InfinityIcon, BookText, CalendarRange, MonitorSmartphone]

function FeaturesSection() {
  return (
    <section id="browse" className="section-shell mt-20">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta">
            Why Members Stay
          </p>
          <h2 className="section-title mt-2">Designed for readers, families, and researchers</h2>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {featureHighlights.map((item, index) => {
          const Icon = iconMap[index]
          return (
            <Motion.div
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
            >
              <Card className="h-full p-5 transition hover:-translate-y-1 hover:shadow-lift">
                <Icon className="mb-4 size-8 text-terracotta" />
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <div className="my-3 h-px w-16 bg-sage/60" />
                <p className="text-sm leading-relaxed text-navy/75 dark:text-cream/75">
                  {item.description}
                </p>
              </Card>
            </Motion.div>
          )
        })}
      </div>
    </section>
  )
}

export default FeaturesSection
