import { useLibrarySettings, defaultLibrary } from '../../../shared/hooks/useLibrarySettings'
import { ArrowRight, BookOpen, Bookmark, Library } from 'lucide-react'
import { Link } from 'react-router-dom'
import '../../information/styles/information.css'
import '../styles/about.css'

export default function AboutPage() {
  const library = useLibrarySettings()
  const name = library.data?.name ?? defaultLibrary.name
  return (
    <div className="about-page">
      <header className="about-heading">
        <div className="container about-heading-content">
          <p className="eyebrow">ABOUT {name.toUpperCase()}</p>
          <h1>
            A shared place.
            <br />
            <span>A world of possibilities.</span>
          </h1>
          <p>
            {name} brings your library collection and your reading life together. Discover a
            different perspective, return to a favorite author, or find a book you never knew you
            needed.
          </p>
        </div>
      </header>
      <div className="container page information-page">
        <section className="information-split">
          <div>
            <h2>Built around readers</h2>
            <p>
              A library starts with a collection, but it comes to life through the people who read
              it. Our website makes that collection easier to explore and helps you keep track of
              what you want to read next.
            </p>
            <p>
              Browse without an account. When you’re ready, become a member to save titles, place
              reservations, and manage your loans.
            </p>
            <Link className="button" to="/catalog">
              Find your next read <ArrowRight size={18} />
            </Link>
          </div>
          <div className="about-services">
            <article>
              <BookOpen size={26} aria-hidden="true" />
              <h3>Discover the collection</h3>
              <p>
                Search by title, author, or ISBN. Explore genres and check which copies are
                available.
              </p>
            </article>
            <article>
              <Bookmark size={26} aria-hidden="true" />
              <h3>Make it personal</h3>
              <p>Keep a reading list and follow your reservations from your member account.</p>
            </article>
            <article>
              <Library size={26} aria-hidden="true" />
              <h3>Stay connected to your library</h3>
              <p>
                Check due dates, renew eligible loans, and collect physical books from library
                staff.
              </p>
            </article>
          </div>
        </section>
        <section className="information-bottom">
          <div>
            <h2>New to borrowing?</h2>
            <p>Learn how reservations, collection, renewals, and returns work.</p>
          </div>
          <Link className="button secondary" to="/faq">
            Read the borrowing guide <ArrowRight size={18} />
          </Link>
        </section>
      </div>
    </div>
  )
}
