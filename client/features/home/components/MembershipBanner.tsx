import { ArrowRight, Bookmark } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/providers/AuthProvider'

export default function MembershipBanner() {
  const { user } = useAuth()
  return (
    <section className="reader-membership">
      <div className="membership-symbol" aria-hidden="true">
        <Bookmark size={35} strokeWidth={1.4} />
      </div>
      <div>
        <p className="eyebrow">YOUR LIBRARY ACCOUNT</p>
        <h2>
          {user ? 'Your next chapter is already waiting.' : 'Keep your reading life together.'}
        </h2>
        <p>Saved titles, reservations, and all your loans in one place.</p>
      </div>
      <Link className="button" to={user ? '/account' : '/register'}>
        {user ? 'Open my library' : 'Become a member'}
        <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </section>
  )
}
