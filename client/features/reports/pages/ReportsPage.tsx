import { usePagedList } from '../../../shared/hooks/usePagedList'
import Pagination from '../../../shared/components/Pagination'
import { formatDate } from '../../../shared/lib/date'
import { downloadReport } from '../../../shared/lib/download'
import { toast } from 'sonner'
import { Button } from '../../../shared/components/primitives/button'
import { useQuery } from '@tanstack/react-query'
import {
  Download,
  BookOpen,
  Library,
  Users,
  ArrowRightLeft,
  CheckCircle2,
  Clock,
  Archive,
  ClipboardList,
} from 'lucide-react'
import { api } from '../../../shared/lib/api'
import type { Loan, Report } from '../../../shared/types'
import { Empty, ErrorState, Loading, PageHeading } from '../../../shared/components/ui'
import ExportPanel from '../components/ExportPanel'

export default function ReportsPage() {
  const report = useQuery({ queryKey: ['reports'], queryFn: () => api<Report>('/staff/reports') })
  const overdue = usePagedList<Loan>('overdue-report', '/loans', 'status=overdue')
  if (report.isPending || overdue.isPending) return <Loading />
  if (report.error || overdue.error) return <ErrorState error={(report.error ?? overdue.error)!} />
  const data = report.data
  return (
    <>
      <PageHeading eyebrow="LIBRARY INSIGHTS" title="Reports" />
      <ExportPanel />
      <div className="metrics-grid">
        {[
          { title: 'Catalog titles', value: data.titles, icon: BookOpen },
          {
            title: 'Available copies',
            value: data.inventory.find((item) => item._id === 'available')?.count ?? 0,
            icon: Library,
          },
          { title: 'Active members', value: data.members, icon: Users },
          {
            title: 'Current loans',
            value: data.activeLoans,
            icon: ArrowRightLeft,
          },
          {
            title: 'Overdue loans',
            value: data.overdueTotal,
            icon: Clock,
          },
          {
            title: 'Returned loans',
            value: data.returnedLoans,
            sub: `${data.totalLoans} loans issued in total`,
            icon: CheckCircle2,
          },
          {
            title: 'Waiting reservations',
            value: data.waiting,
            icon: ClipboardList,
          },
          {
            title: 'Retired copies',
            value: data.inventory.find((item) => item._id === 'retired')?.count ?? 0,
            icon: Archive,
          },
        ].map(({ title, value, sub, icon: Icon }) => (
          <div className="metric" key={title}>
            <div>
              <span>{title}</span>
              <Icon size={20} aria-hidden="true" />
            </div>
            <strong>{value}</strong>
            {sub && <small>{sub}</small>}
          </div>
        ))}
      </div>
      <div className="report-breakdowns">
        <section className="panel">
          <h2>Membership by role and status</h2>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Accounts</th>
                </tr>
              </thead>
              <tbody>
                {data.membership.map((item) => (
                  <tr key={`${item._id.role}-${item._id.status}`}>
                    <td className="capitalize">
                      {item._id.role === 'librarian' ? 'Librarian / staff' : item._id.role}
                    </td>
                    <td className="capitalize">{item._id.status}</td>
                    <td>{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="panel">
          <h2>Reservation outcomes</h2>
          {data.reservationStatuses.length ? (
            <table>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Requests</th>
                </tr>
              </thead>
              <tbody>
                {data.reservationStatuses.map((item) => (
                  <tr key={item._id}>
                    <td className="capitalize">{item._id}</td>
                    <td>{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <Empty title="No reservations yet" />
          )}
        </section>
        <section className="panel">
          <h2>Monthly circulation</h2>
          <p className="muted">
            Loans issued during the last 12 months, grouped in UTC. Months without loans are
            omitted.
          </p>
          {data.monthly.length ? (
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Issued</th>
                </tr>
              </thead>
              <tbody>
                {data.monthly.map((item) => (
                  <tr key={item._id}>
                    <td>{item._id}</td>
                    <td>{item.issued}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <Empty title="No recent circulation" />
          )}
        </section>
        <section className="panel">
          <h2>Most borrowed titles</h2>
          <p className="muted">Top 10 titles across the complete borrowing history.</p>
          {data.popularTitles.length ? (
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Loans</th>
                </tr>
              </thead>
              <tbody>
                {data.popularTitles.map((item) => (
                  <tr key={item._id}>
                    <td>{item.title ?? 'Removed title'}</td>
                    <td>{item.loans}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <Empty title="No borrowing history yet" />
          )}
        </section>
        <section className="panel">
          <h2>Collection by genre</h2>
          {data.genres.length ? (
            <table>
              <thead>
                <tr>
                  <th>Genre</th>
                  <th>Titles</th>
                </tr>
              </thead>
              <tbody>
                {data.genres.map((item) => (
                  <tr key={item._id}>
                    <td>{item._id || 'Uncategorized'}</td>
                    <td>{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <Empty title="No catalog titles yet" />
          )}
        </section>
        <section className="panel">
          <h2>Complete activity exports</h2>
          <p className="muted">
            Download every recorded loan or reservation, including historical records.
          </p>
          <div className="button-row">
            {['loans', 'reservations'].map((kind) => (
              <Button
                key={kind}
                variant="outline"
                onClick={() => {
                  void downloadReport(`/staff/reports/${kind}.csv`, `${kind}.csv`).catch((error) =>
                    toast.error(error.message),
                  )
                }}
              >
                <Download size={17} />
                Export {kind}
              </Button>
            ))}
          </div>
        </section>
      </div>
      <section className="panel">
        <div className="section-heading compact">
          <div>
            <h2>Overdue loans</h2>
            <p className="muted">Contact members and arrange the return of these copies.</p>
          </div>
          <Button
            className="button secondary"
            disabled={!overdue.total}
            onClick={() => {
              void downloadReport('/staff/reports/overdue.csv', 'overdue-loans.csv').catch(
                (error) => toast.error(error.message),
              )
            }}
          >
            <Download size={17} />
            Export overdue
          </Button>
        </div>
        {overdue.total ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Member</th>
                  <th>Email</th>
                  <th>Due date</th>
                </tr>
              </thead>
              <tbody>
                {overdue.data.map((loan) => (
                  <tr key={loan._id}>
                    <td>
                      <strong>{loan.book?.title}</strong>
                    </td>
                    <td>{loan.member?.name}</td>
                    <td>{loan.member?.email}</td>
                    <td className="danger-text">{formatDate(loan.dueAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty title="No overdue loans" />
        )}
        <Pagination {...overdue} />
      </section>
      <section className="panel inventory-report">
        <div>
          <h2>Inventory export</h2>
          <p className="muted">
            Download barcode, title, shelf, and circulation status for the entire inventory.
          </p>
        </div>
        <Button
          className="button secondary"
          onClick={() => {
            void downloadReport('/staff/reports/inventory.csv', 'library-inventory.csv').catch(
              (error) => toast.error(error.message),
            )
          }}
        >
          <Download size={17} />
          Export inventory
        </Button>
      </section>
    </>
  )
}
