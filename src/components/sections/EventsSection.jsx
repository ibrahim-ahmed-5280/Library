import { CalendarClock, MapPin, MicVocal } from 'lucide-react'
import { featuredEvent, upcomingEvents } from '../../data/mockData.js'
import Button from '../common/Button.jsx'
import Card from '../common/Card.jsx'

function EventsSection() {
  return (
    <section id="events" className="section-shell mt-20">
      <div className="mb-6">
        <h2 className="section-title">Upcoming Events and Workshops</h2>
        <p className="mt-2 text-sm text-navy/72 dark:text-cream/72">
          Learn, discuss, and create with neighbors, authors, and educators.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="space-y-3 p-4">
          {upcomingEvents.map((eventItem) => (
            <article
              key={eventItem.id}
              className="rounded-2xl border border-navy/10 bg-white/70 p-3 transition hover:shadow-soft dark:border-cream/10 dark:bg-night/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="rounded-xl bg-terracotta/15 px-3 py-2 text-center text-terracotta">
                  <p className="text-xs font-semibold">{eventItem.month}</p>
                  <p className="text-xl font-semibold leading-none">{eventItem.day}</p>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{eventItem.title}</h3>
                  <p className="mt-1 text-sm text-navy/72 dark:text-cream/72">
                    <CalendarClock className="mr-1 inline size-4" />
                    {eventItem.time}
                  </p>
                  <p className="text-sm text-navy/72 dark:text-cream/72">
                    <MapPin className="mr-1 inline size-4" />
                    {eventItem.location}
                  </p>
                </div>

                <Button variant="outline" className="px-4 py-2 text-xs">
                  RSVP
                </Button>
              </div>
            </article>
          ))}
        </Card>

        <Card className="overflow-hidden p-0">
          <img
            src={featuredEvent.image}
            alt="Featured event audience listening to speaker in library hall"
            className="h-52 w-full object-cover sm:h-64"
            loading="lazy"
          />
          <div className="space-y-3 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-terracotta">
              Featured Event
            </p>
            <h3 className="text-2xl font-semibold">{featuredEvent.title}</h3>
            <p className="text-sm leading-relaxed text-navy/78 dark:text-cream/78">
              {featuredEvent.description}
            </p>
            <p className="text-sm">
              <MicVocal className="mr-1 inline size-4" />
              {featuredEvent.speaker}
            </p>
            <p className="text-sm">
              <CalendarClock className="mr-1 inline size-4" />
              {featuredEvent.time}
            </p>
            <p className="text-sm">
              <MapPin className="mr-1 inline size-4" />
              {featuredEvent.location}
            </p>
          </div>
        </Card>
      </div>
    </section>
  )
}

export default EventsSection
