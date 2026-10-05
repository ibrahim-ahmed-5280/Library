import { usePagedList } from '../../../shared/hooks/usePagedList'
import Pagination from '../../../shared/components/Pagination'
import { useAction } from '../../../shared/hooks/useAction'
import { formatDate } from '../../../shared/lib/date'
import { Button } from '../../../shared/components/primitives/button'
import type { Reservation } from '../../../shared/types'
import {
  Empty,
  ErrorState,
  Loading,
  MutationFeedback,
  PageHeading,
  Status,
} from '../../../shared/components/ui'

function ReservationTableRow({ hold }: { hold: Reservation }) {
  const cancel = useAction(`/reservations/${hold._id}/cancel`)
  return (
    <tr>
      <td>
        <strong>{hold.book?.title}</strong>
      </td>
      <td>
        {hold.member?.name}
        <small>{hold.member?.email}</small>
      </td>
      <td>{formatDate(hold.createdAt)}</td>
      <td>
        <Status value={hold.status} />
      </td>
      <td>
        {hold.status === 'waiting' && (
          <Button
            className="button secondary small"
            disabled={cancel.isPending}
            onClick={() => cancel.mutate(undefined)}
          >
            Cancel request
          </Button>
        )}
        <MutationFeedback error={cancel.error} />
      </td>
    </tr>
  )
}
export default function ReservationsPage() {
  const holds = usePagedList<Reservation>('reservations', '/reservations', 'status=waiting')
  return (
    <>
      <PageHeading
        eyebrow="RESERVATION QUEUE"
        title="Reservations"
        description="Requests are ordered by time. Issue the next available copy to the first waiting reader."
      />
      <section className="panel">
        {holds.isPending ? (
          <Loading />
        ) : holds.error ? (
          <ErrorState error={holds.error} />
        ) : holds.data.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Member</th>
                  <th>Requested</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {holds.data.map((hold) => (
                  <ReservationTableRow key={hold._id} hold={hold} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty title="No reservation requests yet" />
        )}
        <Pagination
          page={holds.page}
          pages={holds.pages}
          total={holds.total}
          setPage={holds.setPage}
        />
      </section>
    </>
  )
}
