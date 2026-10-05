import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import CatalogPreviewSection from '../components/sections/CatalogPreviewSection.jsx'
import EventsSection from '../components/sections/EventsSection.jsx'
import FeaturesSection from '../components/sections/FeaturesSection.jsx'
import HeroSection from '../components/sections/HeroSection.jsx'
import MembershipSection from '../components/sections/MembershipSection.jsx'
import QuickActionsBar from '../components/sections/QuickActionsBar.jsx'
import QuoteBand from '../components/sections/QuoteBand.jsx'
import StatsSection from '../components/sections/StatsSection.jsx'
import { useLibrary } from '../context/LibraryContext.jsx'

function Home() {
  const { books } = useLibrary()
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) {
      return
    }
    const section = document.getElementById(location.hash.slice(1))
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [location.hash])

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <QuickActionsBar />
      <CatalogPreviewSection books={books.slice(0, 8)} />
      <StatsSection />
      <EventsSection />
      <MembershipSection />
      <QuoteBand />
    </>
  )
}

export default Home
