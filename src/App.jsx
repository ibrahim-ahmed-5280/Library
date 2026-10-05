import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import QuickViewModal from './components/books/QuickViewModal.jsx'
import Footer from './components/layout/Footer.jsx'
import Navbar from './components/layout/Navbar.jsx'
import PageTransition from './components/layout/PageTransition.jsx'
import Account from './pages/Account.jsx'
import BookDetails from './pages/BookDetails.jsx'
import Catalog from './pages/Catalog.jsx'
import EventsPage from './pages/EventsPage.jsx'
import Home from './pages/Home.jsx'

function ScrollManager() {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      return
    }

    const target = document.getElementById(location.hash.slice(1))
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [location.pathname, location.hash])

  return null
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes
        location={location}
        key={`${location.pathname}${location.search}${location.hash}`}
      >
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="/catalog"
          element={
            <PageTransition>
              <Catalog />
            </PageTransition>
          }
        />
        <Route
          path="/book/:bookId"
          element={
            <PageTransition>
              <BookDetails />
            </PageTransition>
          }
        />
        <Route
          path="/events"
          element={
            <PageTransition>
              <EventsPage />
            </PageTransition>
          }
        />
        <Route
          path="/account"
          element={
            <PageTransition>
              <Account />
            </PageTransition>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <Navbar />
      <ScrollManager />
      <main className="pt-[128px] lg:pt-[160px]">
        <AnimatedRoutes />
      </main>
      <Footer />
      <QuickViewModal />
    </div>
  )
}

export default App
