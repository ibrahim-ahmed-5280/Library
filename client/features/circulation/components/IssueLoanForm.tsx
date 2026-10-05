import { usePagedList } from '../../../shared/hooks/usePagedList'
import Pagination from '../../../shared/components/Pagination'
import { Input } from '../../../shared/components/primitives/input'
import { useAction } from '../../../shared/hooks/useAction'
import { Button } from '../../../shared/components/primitives/button'
import { useState } from 'react'
import type { Copy, User } from '../../../shared/types'
import { ErrorState, MutationFeedback } from '../../../shared/components/ui'

export default function IssueLoanForm({ onIssued }: { onIssued: () => void }) {
  const [memberId, setMemberId] = useState('')
  const [copyId, setCopyId] = useState('')
  const [memberSearch, setMemberSearch] = useState('')
  const [copySearch, setCopySearch] = useState('')
  const members = usePagedList<User>(
    'members-picker',
    '/staff/members',
    `status=active&q=${encodeURIComponent(memberSearch)}`,
  )
  const copies = usePagedList<Copy>(
    'copies-picker',
    '/staff/copies',
    `status=available&q=${encodeURIComponent(copySearch)}`,
  )
  const issue = useAction('/loans', 'POST', onIssued)
  if (members.error || copies.error) return <ErrorState error={(members.error || copies.error)!} />
  return (
    <form
      className="form-stack"
      onSubmit={(event) => {
        event.preventDefault()
        issue.mutate({ memberId, copyId })
      }}
    >
      <label>
        Search active members
        <Input
          placeholder="Member name or email"
          value={memberSearch}
          onChange={(event) => {
            setMemberSearch(event.target.value)
            setMemberId('')
          }}
        />
      </label>
      <label>
        Member
        <select
          aria-label="Member"
          required
          value={memberId}
          onChange={(event) => setMemberId(event.target.value)}
        >
          <option value="">Select an active member</option>
          {members.data
            .filter((member) => member.status === 'active')
            .map((member) => (
              <option key={member._id} value={member._id}>
                {member.name} ({member.email})
              </option>
            ))}
        </select>
      </label>
      <Pagination
        {...members}
        setPage={(page) => {
          members.setPage(page)
          setMemberId('')
        }}
      />
      <label>
        Search available copies
        <Input
          placeholder="Title, author, barcode, or shelf"
          value={copySearch}
          onChange={(event) => {
            setCopySearch(event.target.value)
            setCopyId('')
          }}
        />
      </label>
      <label>
        Available copy
        <select
          aria-label="Available copy"
          required
          value={copyId}
          onChange={(event) => setCopyId(event.target.value)}
        >
          <option value="">Select a copy by title and barcode</option>
          {copies.data
            .filter((copy) => copy.status === 'available')
            .map((copy) => (
              <option key={copy._id} value={copy._id}>
                {typeof copy.book === 'string' ? copy.book : copy.book?.title} / {copy.barcode} /{' '}
                {copy.shelf}
              </option>
            ))}
        </select>
      </label>
      <p className="muted">
        Borrowing limits, overdue loans, and reservation order are checked before the loan is
        issued.
      </p>
      <Pagination
        {...copies}
        setPage={(page) => {
          copies.setPage(page)
          setCopyId('')
        }}
      />
      <MutationFeedback error={issue.error} />
      <Button className="button" disabled={issue.isPending}>
        {issue.isPending ? 'Issuing...' : 'Issue loan'}
      </Button>
    </form>
  )
}
