import { usePagedList } from '../../../shared/hooks/usePagedList'
import Pagination from '../../../shared/components/Pagination'
import { Input } from '../../../shared/components/primitives/input'
import { Button } from '../../../shared/components/primitives/button'
import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import type { User } from '../../../shared/types'
import {
  Empty,
  ErrorState,
  Loading,
  Modal,
  PageHeading,
  Status,
} from '../../../shared/components/ui'
import MemberForm from '../components/MemberForm'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../auth/providers/AuthProvider'

export default function MembersPage({ team = false }: { team?: boolean }) {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [editor, setEditor] = useState<User | 'new' | null>(null)
  const members = usePagedList<User>(
    team ? 'team' : 'members',
    '/staff/members',
    `group=${team ? 'team' : 'members'}&q=${encodeURIComponent(search)}`,
  )
  const filtered = members.data
  if (team && user?.role !== 'admin') return <Navigate to="/staff" replace />
  return (
    <>
      <PageHeading
        eyebrow="LIBRARY COMMUNITY"
        title={team ? 'Admins & staff' : 'Members'}
        description={
          team
            ? 'Manage administrator and librarian access separately from readers.'
            : 'Manage reader memberships and account access.'
        }
      >
        <Button className="button" onClick={() => setEditor('new')}>
          <Plus size={18} />
          {team ? 'Create staff account' : 'Register member'}
        </Button>
      </PageHeading>
      <section className="panel">
        <div className="table-toolbar">
          <div className="search-input">
            <Search size={18} />
            <Input
              aria-label="Search members"
              placeholder="Find by name or email"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <span className="muted">{members.total} accounts</span>
        </div>
        {members.isPending ? (
          <Loading />
        ) : members.error ? (
          <ErrorState error={members.error} />
        ) : filtered.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((member) => (
                  <tr key={member._id}>
                    <td>
                      <div className="member-cell">
                        <span className="avatar">{member.name.slice(0, 2).toUpperCase()}</span>
                        <strong>{member.name}</strong>
                      </div>
                    </td>
                    <td>{member.email}</td>
                    <td className="capitalize">{member.role}</td>
                    <td>
                      <Status value={member.status} />
                    </td>
                    <td>
                      <Button className="button secondary small" onClick={() => setEditor(member)}>
                        Manage
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty title="No matching members" />
        )}
        <Pagination
          page={members.page}
          pages={members.pages}
          total={members.total}
          setPage={members.setPage}
        />
      </section>
      <Modal
        title={
          team
            ? editor === 'new'
              ? 'Create staff account'
              : 'Manage staff account'
            : editor === 'new'
              ? 'Register a member'
              : 'Manage member'
        }
        description="Member accounts can borrow and reserve. Staff permissions are managed by administrators."
        open={!!editor}
        onOpenChange={(open) => {
          if (!open) setEditor(null)
        }}
      >
        {editor && (
          <MemberForm
            team={team}
            key={editor === 'new' ? 'new' : editor._id}
            member={editor === 'new' ? undefined : editor}
            onSaved={() => setEditor(null)}
          />
        )}
      </Modal>
    </>
  )
}
