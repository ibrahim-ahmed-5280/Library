import { useAction } from '../../../shared/hooks/useAction'
import { formatDate } from '../../../shared/lib/date'

import { Button } from '../../../shared/components/primitives/button'

import type { Loan } from '../../../shared/types'
import { MutationFeedback, Status } from '../../../shared/components/ui'

export default function LoanRow({ loan }: { loan: Loan }) {
  const renew = useAction(`/loans/${loan._id}/renew`)
  const overdue = !loan.returnedAt && new Date(loan.dueAt) < new Date()
  return (
    <div className="account-row">
      <div>
        <h3>{loan.book?.title ?? 'Archived title'}</h3>
        <p className="muted">
          {loan.returnedAt
            ? `Returned ${formatDate(loan.returnedAt)}`
            : `Due ${formatDate(loan.dueAt)}`}{' '}
          · {loan.renewals} renewals
        </p>
        <MutationFeedback error={renew.error} success={renew.isSuccess} message="Loan renewed." />
      </div>
      <Status value={loan.returnedAt ? 'returned' : overdue ? 'overdue' : 'on_loan'} />
      {!loan.returnedAt && (
        <Button
          className="button secondary"
          disabled={renew.isPending || overdue}
          onClick={() => renew.mutate(undefined)}
        >
          Renew
        </Button>
      )}
    </div>
  )
}
