import { usePagedList } from '../../../shared/hooks/usePagedList'
import Pagination from '../../../shared/components/Pagination'
import { formatDate } from '../../../shared/lib/date'
import type { AuditEntry } from '../../../shared/types'
import { Empty, ErrorState, Loading, PageHeading } from '../../../shared/components/ui'

export default function AuditPage() {
  const audit = usePagedList<AuditEntry>('audit', '/staff/audit', '')
  return (
    <>
      <PageHeading
        eyebrow="ACCOUNTABILITY"
        title="Audit history"
        description="Browse all recorded changes to books, membership, circulation, and policies."
      />
      <section className="panel">
        {audit.isPending ? (
          <Loading />
        ) : audit.error ? (
          <ErrorState error={audit.error} />
        ) : audit.data.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Staff / member</th>
                  <th>Record ID</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {audit.data.map((entry) => (
                  <tr key={entry._id}>
                    <td>
                      <strong>{entry.action}</strong>
                    </td>
                    <td>
                      {entry.actor?.name}
                      <small>{entry.actor?.email}</small>
                    </td>
                    <td className="mono">{entry.entity}</td>
                    <td>{formatDate(entry.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty title="No activity recorded yet" />
        )}
        <Pagination
          page={audit.page}
          pages={audit.pages}
          total={audit.total}
          setPage={audit.setPage}
        />
      </section>
    </>
  )
}
