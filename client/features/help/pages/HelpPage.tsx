import { useLibrarySettings } from '../../../shared/hooks/useLibrarySettings'
import ContactForm from '../components/ContactForm'
import { ArrowRight, Mail, Phone, MapPin, Clock, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import '../../information/styles/information.css'
import '../styles/contact.css'

export default function HelpPage() {
  const details = useLibrarySettings()
  const contact = details.data ?? { email: '', phone: '', address: '', hours: '' }
  const hasDetails = [contact.email, contact.phone, contact.address, contact.hours].some(Boolean)
  return (
    <div className="contact-page">
      <header className="contact-heading">
        <div className="container">
          <p className="eyebrow">HERE TO HELP</p>
          <h1>Contact us.</h1>
          <p>Have a question or a request? Send a message to the library team.</p>
        </div>
      </header>
      <div className="container page contact-content">
        <ContactForm />
        <div className="contact-sidebar">
          <section className="contact-details" aria-labelledby="contact-title">
            <h2 id="contact-title">Speak with the library team</h2>
            <p className="muted">
              Library staff can help with collecting and returning books, reservations, and account
              access.
            </p>
            {hasDetails ? (
              <dl className="contact-list">
                {contact.email && (
                  <div>
                    <Mail aria-hidden="true" size={21} />
                    <dt>Email</dt>
                    <dd>
                      <a href={`mailto:${contact.email}`}>{contact.email}</a>
                    </dd>
                  </div>
                )}
                {contact.phone && (
                  <div>
                    <Phone aria-hidden="true" size={21} />
                    <dt>Phone</dt>
                    <dd>
                      <a href={`tel:${contact.phone.replace(/[^+0-9]/g, '')}`}>{contact.phone}</a>
                    </dd>
                  </div>
                )}
                {contact.address && (
                  <div>
                    <MapPin aria-hidden="true" size={21} />
                    <dt>Visit</dt>
                    <dd>{contact.address}</dd>
                  </div>
                )}
                {contact.hours && (
                  <div>
                    <Clock aria-hidden="true" size={21} />
                    <dt>Opening hours</dt>
                    <dd>{contact.hours}</dd>
                  </div>
                )}
              </dl>
            ) : (
              <p className="contact-unavailable">
                Public contact details have not been added yet. For collection and return
                arrangements, speak with staff at your library.
              </p>
            )}
          </section>
          <aside className="contact-self-service">
            <BookOpen size={28} aria-hidden="true" />
            <h2>A quick answer may be here.</h2>
            <p>
              Find answers about membership, reservations, renewals, and the library's current
              borrowing rules.
            </p>
            <Link className="button" to="/faq">
              Read the FAQs <ArrowRight size={18} />
            </Link>
            <Link className="text-link" to="/account">
              Manage my loans and reservations <ArrowRight size={17} />
            </Link>
          </aside>
        </div>
      </div>
    </div>
  )
}
