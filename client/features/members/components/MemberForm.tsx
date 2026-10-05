import { useAction } from '../../../shared/hooks/useAction'
import { Input } from '../../../shared/components/primitives/input'
import { Button } from '../../../shared/components/primitives/button'
import { useState } from 'react'
import { toast } from 'sonner'
import { PasswordInput } from '../../auth/components/PasswordInput'
import type { User } from '../../../shared/types'
import { MutationFeedback } from '../../../shared/components/ui'
import { useAuth } from '../../auth/providers/AuthProvider'

export default function MemberForm({
  member,
  onSaved,
  team = false,
}: {
  member?: User
  onSaved: () => void
  team?: boolean
}) {
  const { user } = useAuth()
  const [name, setName] = useState(member?.name ?? '')
  const [email, setEmail] = useState(member?.email ?? '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState(member?.status ?? 'active')
  const [role, setRole] = useState(member?.role ?? (team ? 'librarian' : 'member'))
  const action = useAction(
    member ? `/staff/members/${member._id}` : '/staff/members',
    member ? 'PATCH' : 'POST',
    onSaved,
  )
  return (
    <form
      className="form-stack"
      onSubmit={(event) => {
        event.preventDefault()
        if (!member && password !== confirmPassword) {
          toast.error('Passwords do not match.')
          return
        }
        action.mutate(
          member ? { name, status, role } : { name, email, password, ...(team ? { role } : {}) },
        )
      }}
    >
      <label>
        Full name
        <Input
          required
          minLength={2}
          maxLength={100}
          placeholder={team ? 'Enter the staff member’s full name' : 'Enter the member’s full name'}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>
      <label>
        Email address
        <Input
          required
          type="email"
          readOnly={!!member}
          placeholder={team ? 'staff@example.com' : 'member@example.com'}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      {!member && (
        <label>
          Initial password
          <PasswordInput
            aria-label="Initial password"
            placeholder="Create an initial password (at least 12 characters)"
            type="password"
            required
            minLength={12}
            maxLength={128}
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <small className="muted">
            At least 12 characters. Share this privately with the member.
          </small>
        </label>
      )}
      {!member && (
        <label>
          Confirm password
          <PasswordInput
            aria-label="Confirm password"
            placeholder="Re-enter the initial password"
            autoComplete="new-password"
            required
            minLength={12}
            maxLength={128}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </label>
      )}
      {!member && team && (
        <label>
          Role
          <select value={role} onChange={(event) => setRole(event.target.value as typeof role)}>
            <option value="librarian">Librarian</option>
            <option value="admin">Administrator</option>
          </select>
        </label>
      )}
      {member && (
        <>
          <label>
            Membership status
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as typeof status)}
            >
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </label>
          <label>
            Role
            <select
              disabled={user?.role !== 'admin'}
              value={role}
              onChange={(event) => setRole(event.target.value as typeof role)}
            >
              <option value="member">Member</option>
              <option value="librarian">Librarian</option>
              <option value="admin">Administrator</option>
            </select>
          </label>
        </>
      )}
      <MutationFeedback error={action.error} />
      <Button className="button" disabled={action.isPending}>
        {action.isPending
          ? 'Saving...'
          : member
            ? 'Save member'
            : team
              ? 'Create staff account'
              : 'Register member'}
      </Button>
    </form>
  )
}
