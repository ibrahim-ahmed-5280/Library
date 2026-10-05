import { ArrowRight, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import type { PolicyInput } from '../../../../server/contracts/schemas'
import { api } from '../../../shared/lib/api'
import { ErrorState, Loading } from '../../../shared/components/ui'
import '../../information/styles/information.css'

const questions = [
  {
    question: 'How do I become a member?',
    answer:
      'Select Sign in and choose Create an account. Enter your name, email, and a password of at least 12 characters. Your account keeps your saved titles, reservations, and loan history together.',
  },
  {
    question: 'How do I borrow a book?',
    answer:
      'Find a title in the catalog and open its details. Sign in to place a reservation, then arrange collection with library staff. Staff issue a specific physical copy and record its due date.',
  },
  {
    question: 'Does a reservation guarantee immediate collection?',
    answer:
      'A reservation joins the queue for a title. Requests are handled in order, and a copy may already be on loan. Track the request in My library and check with staff before visiting to collect it.',
  },
  {
    question: 'What is the difference between saving and reserving?',
    answer:
      'Saving adds a title to your personal reading list. It does not reserve a copy. Reserving records a request to borrow a title when a copy is available for you.',
  },
  {
    question: 'Can I renew a loan?',
    answer:
      'Open My library, find your current loan, and select Renew. A loan cannot be renewed if it is overdue, has reached the renewal limit, or has a waiting reservation.',
  },
  {
    question: 'How do I return or cancel a request?',
    answer:
      'Return physical copies to library staff so they can record the return. To cancel a waiting reservation, open Reservations in My library and select Cancel.',
  },
  {
    question: 'What happens if a book is overdue?',
    answer:
      'Overdue loans appear in your account. Please return the books or speak to library staff. New borrowing is blocked while you have overdue loans.',
  },
  {
    question: 'Where can I see updates about my loans?',
    answer:
      'Open Notifications in My library for borrowing and reservation updates. These notices are available in your account. With a verified email address, the library can also send borrowing updates and reminders when email delivery is enabled.',
  },
]
export default function FaqPage() {
  const policy = useQuery({
    queryKey: ['public-policies'],
    queryFn: () => api<PolicyInput>('/library/policies'),
  })
  return (
    <div className="container page information-page">
      <header className="information-heading">
        <p className="eyebrow">A HAND WITH YOUR NEXT CHAPTER</p>
        <h1>Borrowing, made clear.</h1>
        <p>
          Everything you need to get started, keep track of your books, and make the most of your
          library account.
        </p>
      </header>
      <section className="borrowing-policy" aria-labelledby="rules-title">
        <div>
          <h2 id="rules-title">Current borrowing rules</h2>
          <p className="muted">The library’s current limits for issuing and renewing loans.</p>
        </div>
        {policy.isPending ? (
          <Loading />
        ) : policy.error ? (
          <ErrorState
            error={policy.error}
            retry={() => {
              void policy.refetch()
            }}
          />
        ) : (
          <dl className="public-policy-grid">
            <div>
              <dd>
                {policy.data.loanDays}
                <span>days</span>
              </dd>
              <dt>Initial loan period</dt>
            </div>
            <div>
              <dd>
                {policy.data.maxLoans}
                <span>books</span>
              </dd>
              <dt>Maximum active loans</dt>
            </div>
            <div>
              <dd>
                {policy.data.maxRenewals}
                <span>renewals</span>
              </dd>
              <dt>Per eligible loan</dt>
            </div>
            <div>
              <dd>
                {policy.data.renewalDays}
                <span>days</span>
              </dd>
              <dt>Added by each renewal</dt>
            </div>
          </dl>
        )}
      </section>
      <section className="help-questions">
        <h2>Frequently asked questions</h2>
        <div>
          {questions.map((item) => (
            <details key={item.question}>
              <summary>
                {item.question}
                <ChevronDown size={18} aria-hidden="true" />
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="information-bottom">
        <div>
          <h2>Ready to find something good?</h2>
          <p>Search the collection, then save or reserve a title.</p>
        </div>
        <Link className="button" to="/catalog">
          Browse the collection <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  )
}
