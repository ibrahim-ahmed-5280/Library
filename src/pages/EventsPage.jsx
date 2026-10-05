import { CalendarClock, MapPin, Sparkles } from 'lucide-react'
import Button from '../components/common/Button.jsx'
import Card from '../components/common/Card.jsx'
import { featuredEvent, upcomingEvents } from '../data/mockData.js'

function EventsPage() {
  return (
    <section className="section-shell pb-6">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-terracotta">
          Events
        </p>
        <h1 className="section-title mt-2">Learn together at the library</h1>
        <p className="mt-2 max-w-2xl text-sm text-navy/72 dark:text-cream/72">
          Author conversations, family programs, skill-building workshops, and
          community-led sessions hosted every week.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden p-0">
          <img
            src={featuredEvent.image}
            alt="Community event audience at public library"
            className="h-64 w-full object-cover"
            loading="lazy"
          />
          <div className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-terracotta">
              Spotlight
            </p>
            <h2 className="mt-2 text-3xl font-semibold">{featuredEvent.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-navy/78 dark:text-cream/78">
              {featuredEvent.description}
            </p>
            <p className="mt-3 text-sm">
              <CalendarClock className="mr-1 inline size-4" />
              {featuredEvent.time}
            </p>
            <p className="text-sm">
              <MapPin className="mr-1 inline size-4" />
              {featuredEvent.location}
            </p>
            <Button className="mt-5">
              <Sparkles className="size-4" />
              Reserve a Seat
            </Button>
          </div>
        </Card>

        <div className="space-y-3">
          {upcomingEvents.map((eventItem) => (
            <Card key={eventItem.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-terracotta/15 px-3 py-2 text-center text-terracotta">
                  <p className="text-xs font-semibold">{eventItem.month}</p>
                  <p className="text-2xl font-semibold leading-none">{eventItem.day}</p>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{eventItem.title}</h3>
                  <p className="mt-1 text-sm text-navy/72 dark:text-cream/72">
                    {eventItem.time}
                  </p>
                  <p className="text-sm text-navy/72 dark:text-cream/72">
                    {eventItem.location}
                  </p>
                </div>
                <Button variant="outline" className="px-4 py-2 text-xs">
                  RSVP
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default EventsPage
