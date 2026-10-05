import { formatDate } from '../../../shared/lib/date'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ArrowRight, Plus, ArrowRightLeft, Users, BookOpen } from 'lucide-react'
import { api } from '../../../shared/lib/api'
import type { Report } from '../../../shared/types'
import { Empty, ErrorState, Loading, PageHeading } from '../../../shared/components/ui'
import { useAuth } from '../../auth/providers/AuthProvider'
import OverviewCharts from '../components/OverviewCharts'

export default function DashboardPage() {
  const { user } = useAuth()
  const report = useQuery({ queryKey: ['reports'], queryFn: () => api<Report>('/staff/reports') })
  if (report.isPending) return <Loading />
  if (report.error)
    return (
      <ErrorState
        error={report.error}
        retry={() => {
          void report.refetch()
        }}
      />
    )
  const data = report.data
  return (
    <>
      <PageHeading
        eyebrow="LIBRARY OVERVIEW"
        title={`Good to see you, ${user?.name.split(' ')[0]}`}
      >
        <Link className="button" to="/staff/circulation">
          <Plus size={18} />
          Issue a loan
        </Link>
      </PageHeading>
      <div className="metrics-grid">
        {[
          {
            title: 'Catalog titles',
            value: data.titles,
            sub: `${data.copies} physical copies`,
            icon: BookOpen,
          },
          {
            title: 'Active members',
            value: data.members,
            icon: Users,
          },
          {
            title: 'Current loans',
            value: data.activeLoans,
            sub: `${data.waiting} waiting reservations`,
            icon: ArrowRightLeft,
          },
          {
            title: 'Overdue loans',
            value: data.overdueTotal,
            icon: BookOpen,
          },
        ].map(({ title, value, sub, icon: Icon }) => (
          <div className="metric" key={title}>
            <div>
              <span>{title}</span>
              <Icon size={19} />
            </div>
            <strong>{value.toLocaleString()}</strong>
            {sub && <small>{sub}</small>}
          </div>
        ))}
      </div>
      <OverviewCharts data={data} />
      <div className="dashboard-grid">
        <section className="panel">
          <div className="section-heading compact">
            <div>
              <h2>Needs attention</h2>
              <p className="muted">Overdue books and outstanding returns.</p>
            </div>
            <Link className="text-link" to="/staff/reports">
              View report <ArrowRight size={16} />
            </Link>
          </div>
          {data.overdueTotal ? (
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Member</th>
                    <th>Due date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.overdue.slice(0, 6).map((loan) => (
                    <tr key={loan._id}>
                      <td className="table-title">{loan.book?.title}</td>
                      <td>{loan.member?.name}</td>
                      <td className="danger-text">{formatDate(loan.dueAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty title="Everything is on track">
              <p className="muted">No overdue loans at the moment.</p>
            </Empty>
          )}
        </section>
        <section className="panel">
          <h2>Quick actions</h2>
          <div className="quick-actions">
            <Link to="/staff/inventory">
              <BookOpen size={21} />
              <div>
                <strong>Grow the collection</strong>
                <small>Add titles and physical copies</small>
              </div>
              <ArrowRight size={17} />
            </Link>
            <Link to="/staff/members">
              <Users size={21} />
              <div>
                <strong>Manage members</strong>
                <small>Register and update library accounts</small>
              </div>
              <ArrowRight size={17} />
            </Link>
            <Link to="/staff/circulation">
              <ArrowRightLeft size={21} />
              <div>
                <strong>At the circulation desk</strong>
                <small>Issue, renew, and return books</small>
              </div>
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </div>
      <section className="panel activity-panel">
        <div className="section-heading compact">
          <div>
            <h2>Recent activity</h2>
            <p className="muted">A record of changes made by your team.</p>
          </div>
          {user?.role === 'admin' && (
            <Link className="text-link" to="/staff/audit">
              All activity <ArrowRight size={16} />
            </Link>
          )}
        </div>
        {data.recent.length ? (
          data.recent.map((entry) => (
            <div className="activity-row" key={entry._id}>
              <span className="activity-icon">
                <ArrowRightLeft size={16} />
              </span>
              <div>
                <strong>{entry.action.replaceAll('.', ' ').replaceAll('_', ' ')}</strong>
                <small>{entry.actor?.name ?? 'Library staff'}</small>
              </div>
              <time>{formatDate(entry.createdAt)}</time>
            </div>
          ))
        ) : (
          <Empty title="Your library’s story starts here">
            <p className="muted">Changes will appear as your team works.</p>
          </Empty>
        )}
      </section>
    </>
  )
}
