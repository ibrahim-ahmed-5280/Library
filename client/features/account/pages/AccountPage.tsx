import { usePagedList } from '../../../shared/hooks/usePagedList'
import Pagination from '../../../shared/components/Pagination'
import LoanRow from '../components/LoanRow'
import ReservationRow from '../components/ReservationRow'
import NotificationRow from '../components/NotificationRow'
import ProfilePage from './ProfilePage'

import { Button } from '../../../shared/components/primitives/button'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/providers/AuthProvider'
import { api } from '../../../shared/lib/api'
import type { Book, Loan, Notification, Reservation } from '../../../shared/types'
import { Empty, ErrorState, Loading, PageHeading } from '../../../shared/components/ui'
import { BookCover } from '../../catalog/components/BookCover'

export default function Account() {
  const { user, signOut } = useAuth()
  const [tab, setTab] = useState('loans')
  const [logoutError, setLogoutError] = useState<Error | null>(null)
  const loans = usePagedList<Loan>('loans-mine', '/loans', 'scope=mine')
  const holds = usePagedList<Reservation>('holds-mine', '/reservations', 'scope=mine')
  const saved = useQuery({ queryKey: ['saved'], queryFn: () => api<Book[]>('/me/saved') })
  const summary = useQuery({
    queryKey: ['account-summary'],
    queryFn: () =>
      api<{ currentLoans: number; reservations: number; unreadNotices: number }>('/me/summary'),
  })
  const notifications = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api<{ items: Notification[]; overdue: Loan[] }>('/notifications'),
  })
  const tabs = ['loans', 'reservations', 'saved', 'notifications', 'profile']
  const loading =
    loans.isPending ||
    holds.isPending ||
    saved.isPending ||
    notifications.isPending ||
    summary.isPending
  const error = loans.error || holds.error || saved.error || notifications.error || summary.error
  return (
    <div className="container page">
      <PageHeading
        eyebrow="MY LIBRARY"
        title={`Welcome back, ${user?.name.split(' ')[0]}`}
        description="A little space for your books and everything you want to read next."
      >
        <Button
          className="button secondary"
          onClick={() => {
            void signOut().catch(setLogoutError)
          }}
        >
          Sign out
        </Button>
      </PageHeading>
      {logoutError && <ErrorState error={logoutError} />}
      <div className="account-metrics">
        <div>
          <span>Current loans</span>
          <strong>{summary.data?.currentLoans ?? 0}</strong>
        </div>
        <div>
          <span>Reservations</span>
          <strong>{summary.data?.reservations ?? 0}</strong>
        </div>
        <div>
          <span>Saved titles</span>
          <strong>{saved.data?.length ?? 0}</strong>
        </div>
        <div>
          <span>Unread notices</span>
          <strong>{summary.data?.unreadNotices ?? 0}</strong>
        </div>
      </div>
      <nav className="tabs" aria-label="Account sections">
        {tabs.map((item) => (
          <button
            key={item}
            className={tab === item ? 'active' : ''}
            onClick={() => setTab(item)}
            aria-current={tab === item ? 'page' : undefined}
          >
            {item === 'saved' ? 'Reading list' : item[0].toUpperCase() + item.slice(1)}
          </button>
        ))}
      </nav>
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorState error={error} />
      ) : (
        <>
          {tab === 'loans' && (
            <section className="panel">
              <h2>Loans & reading history</h2>
              {loans.data?.length ? (
                loans.data.map((loan) => <LoanRow key={loan._id} loan={loan} />)
              ) : (
                <Empty title="Your next chapter is waiting">
                  <Link className="text-link" to="/catalog">
                    Explore the catalog
                  </Link>
                </Empty>
              )}
              <Pagination {...loans} />
            </section>
          )}
          {tab === 'reservations' && (
            <section className="panel">
              <h2>Your reservations</h2>
              {holds.data?.length ? (
                holds.data.map((hold) => <ReservationRow key={hold._id} hold={hold} />)
              ) : (
                <Empty title="No reservations yet" />
              )}
              <Pagination {...holds} />
            </section>
          )}
          {tab === 'saved' && (
            <div className="saved-grid">
              {saved.data?.length ? (
                saved.data.map((book) => (
                  <Link key={book._id} to={`/book/${book._id}`}>
                    <BookCover book={book} />
                    <h3>{book.title}</h3>
                    <p className="muted">{book.author}</p>
                  </Link>
                ))
              ) : (
                <Empty title="Start your reading list">
                  <p className="muted">Save a title from its details page.</p>
                </Empty>
              )}
            </div>
          )}
          {tab === 'notifications' && (
            <section className="panel">
              <h2>Library notifications</h2>
              {notifications.data?.overdue.length ? (
                <p className="form-error" role="status">
                  You have {notifications.data.overdue.length} overdue loan(s). Please return them
                  to the library.
                </p>
              ) : null}
              {notifications.data?.items.length ? (
                notifications.data.items.map((item) => (
                  <NotificationRow key={item._id} item={item} />
                ))
              ) : (
                <Empty title="You’re all caught up" />
              )}
            </section>
          )}
          {tab === 'profile' && <ProfilePage />}
        </>
      )}
    </div>
  )
}
