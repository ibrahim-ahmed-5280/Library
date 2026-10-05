import { useAction } from '../../../shared/hooks/useAction'
import { formatDate } from '../../../shared/lib/date'
import { Button } from '../../../shared/components/primitives/button'
import { useState } from 'react'
import type { Loan } from '../../../shared/types'
import { Modal, MutationFeedback, Status } from '../../../shared/components/ui'

export default function LoanTableRow({ loan }: { loan: Loan }) {
  const [confirm, setConfirm] = useState(false)
  const renew = useAction(`/loans/${loan._id}/renew`)
  const returned = useAction(`/loans/${loan._id}/return`, 'POST', () => setConfirm(false))
  const overdue = !loan.returnedAt && new Date(loan.dueAt) < new Date()
  return (
    <tr>
      <td>
        <strong>{loan.book?.title}</strong>
        <small>{loan.copy?.barcode}</small>
      </td>
      <td>
        {loan.member?.name}
        <small>{loan.member?.email}</small>
      </td>
      <td>{formatDate(loan.dueAt)}</td>
      <td>
        <Status value={loan.returnedAt ? 'returned' : overdue ? 'overdue' : 'on_loan'} />
      </td>
      <td>
        <div className="button-row">
          {!loan.returnedAt && (
            <>
              <Button
                className="button secondary small"
                disabled={renew.isPending || overdue}
                onClick={() => renew.mutate(undefined)}
              >
                Renew
              </Button>
              <Button className="button secondary small" onClick={() => setConfirm(true)}>
                Return
              </Button>
            </>
          )}
        </div>
        <MutationFeedback error={renew.error} success={renew.isSuccess} message="Renewed." />
        <Modal
          title="Record a return"
          description="Confirm that this physical copy has been returned to the library."
          open={confirm}
          onOpenChange={setConfirm}
        >
          <p className="return-summary">
            <strong>{loan.book?.title}</strong>
            <br />
            Barcode: {loan.copy?.barcode}
            <br />
            Member: {loan.member?.name}
          </p>
          <MutationFeedback error={returned.error} />
          <Button
            className="button"
            disabled={returned.isPending}
            onClick={() => returned.mutate(undefined)}
          >
            {returned.isPending ? 'Recording...' : 'Confirm return'}
          </Button>
        </Modal>
      </td>
    </tr>
  )
}
