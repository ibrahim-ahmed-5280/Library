import { useAction } from '../../../shared/hooks/useAction'
import { formatDate } from '../../../shared/lib/date'

import { Button } from '../../../shared/components/primitives/button'

import type { Reservation } from '../../../shared/types'
import { MutationFeedback, Status } from '../../../shared/components/ui'

export default function ReservationRow({ hold }: { hold: Reservation }) {
  const cancel = useAction(`/reservations/${hold._id}/cancel`)
  return (
    <div className="account-row">
      <div>
        <h3>{hold.book?.title ?? 'Archived title'}</h3>
        <p className="muted">Requested {formatDate(hold.createdAt)}</p>
        <MutationFeedback error={cancel.error} />
      </div>
      <Status value={hold.status} />
      {hold.status === 'waiting' && (
        <Button
          className="button secondary"
          disabled={cancel.isPending}
          onClick={() => cancel.mutate(undefined)}
        >
          Cancel
        </Button>
      )}
    </div>
  )
}
