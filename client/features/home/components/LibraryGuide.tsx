import { ArrowRight, BookOpen, Bookmark, Library } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function LibraryGuide() {
  return (
    <section className="reader-guide" aria-labelledby="guide-title">
      <div className="reader-guide-intro">
        <p className="eyebrow">MORE THAN A BOOK ON A SHELF</p>
        <h2 id="guide-title">
          Your library.
          <br />
          At your own pace.
        </h2>
        <p>Start with a little curiosity. We’ll help you turn it into your next read.</p>
        <Link to="/faq" className="text-link">
          How borrowing works <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>
      <div className="reader-guide-items">
        <Link to="/catalog">
          <span className="guide-icon">
            <BookOpen size={24} aria-hidden="true" />
          </span>
          <div>
            <h3>Find something that speaks to you</h3>
            <p>Browse by genre or search for a title, author, or ISBN.</p>
          </div>
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
        <Link to="/account">
          <span className="guide-icon">
            <Bookmark size={24} aria-hidden="true" />
          </span>
          <div>
            <h3>Keep your next reads close</h3>
            <p>Save favorites and reserve the titles you want to borrow.</p>
          </div>
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
        <Link to="/faq">
          <span className="guide-icon">
            <Library size={24} aria-hidden="true" />
          </span>
          <div>
            <h3>Collect, read, and return</h3>
            <p>Collect your copy from library staff and follow due dates in your account.</p>
          </div>
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
