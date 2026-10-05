import { usePagedList } from '../../../shared/hooks/usePagedList'
import Pagination from '../../../shared/components/Pagination'
import { Button } from '../../../shared/components/primitives/button'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { Loan } from '../../../shared/types'
import { Empty, ErrorState, Loading, Modal, PageHeading } from '../../../shared/components/ui'
import IssueLoanForm from '../components/IssueLoanForm'
import LoanTableRow from '../components/LoanTableRow'

export default function CirculationPage() {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState('active')
  const loans = usePagedList<Loan>('loans', '/loans', `status=${filter}`)
  const filtered = loans.data
  return (
    <>
      <PageHeading
        eyebrow="CIRCULATION DESK"
        title="Loans & returns"
        description="Keep books moving and readers informed."
      >
        <Button className="button" onClick={() => setOpen(true)}>
          <Plus size={18} />
          Issue loan
        </Button>
      </PageHeading>
      <section className="panel">
        <div className="table-toolbar">
          <nav className="tabs inline" aria-label="Loan filters">
            {['active', 'overdue', 'all'].map((item) => (
              <button
                className={item === filter ? 'active' : ''}
                key={item}
                onClick={() => setFilter(item)}
              >
                {item === 'all' ? 'All history' : item === 'active' ? 'Current loans' : 'Overdue'}
              </button>
            ))}
          </nav>
          <span className="muted">{loans.total} loans</span>
        </div>
        {loans.isPending ? (
          <Loading />
        ) : loans.error ? (
          <ErrorState error={loans.error} />
        ) : filtered.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Book / copy</th>
                  <th>Member</th>
                  <th>Due date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((loan) => (
                  <LoanTableRow key={loan._id} loan={loan} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty title="No loans in this view" />
        )}
        <Pagination
          page={loans.page}
          pages={loans.pages}
          total={loans.total}
          setPage={loans.setPage}
        />
      </section>
      <Modal
        title="Issue a loan"
        description="Select the member and the physical copy they are collecting."
        open={open}
        onOpenChange={setOpen}
      >
        {open && <IssueLoanForm onIssued={() => setOpen(false)} />}
      </Modal>
    </>
  )
}
