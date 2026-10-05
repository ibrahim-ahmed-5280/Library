import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../../auth/providers/AuthProvider'
import { useAction } from '../../../shared/hooks/useAction'
import { Input } from '../../../shared/components/primitives/input'
import { PasswordInput } from '../../auth/components/PasswordInput'
import { Button } from '../../../shared/components/primitives/button'
import { PageHeading } from '../../../shared/components/ui'
import ProfilePhoto from '../components/ProfilePhoto'
import type { User } from '../../../shared/types'

export default function ProfilePage() {
  const { user, updateUser, signOut } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const resetFields = () => {
    setName(user?.name ?? '')
    setEmail(user?.email ?? '')
    setCurrentPassword('')
    setPassword('')
    setConfirmPassword('')
  }
  const save = useAction<User & { requiresSignIn?: boolean }>('/me', 'PATCH', (updated) => {
    if (updated.requiresSignIn) {
      void signOut()
        .catch((error) => toast.error(error.message))
        .finally(() => navigate('/login', { replace: true }))
    } else {
      updateUser(updated)
      setEditing(false)
    }
  })
  const verify = useAction('/auth/resend-verification')
  const sensitive = email.trim().toLowerCase() !== user?.email || !!password
  return (
    <>
      <PageHeading
        eyebrow="YOUR ACCOUNT"
        title="My profile"
        description="Your personal details, profile photo, and account security."
      ></PageHeading>
      <section className="panel profile-editor">
        <div className="profile-card-heading">
          <ProfilePhoto editing={editing} onUploading={setUploading} />
          {!editing && (
            <Button
              onClick={() => {
                resetFields()
                setEditing(true)
              }}
            >
              <Pencil size={17} />
              Edit profile
            </Button>
          )}
        </div>
        {editing ? (
          <form
            className="form-stack"
            onSubmit={(event) => {
              event.preventDefault()
              if (password !== confirmPassword) {
                toast.error('Passwords do not match.')
                return
              }
              save.mutate({
                name,
                email,
                ...(sensitive ? { currentPassword } : {}),
                ...(password ? { password, confirmPassword } : {}),
              })
            }}
          >
            <div className="profile-edit-fields">
              <label>
                Full name
                <Input
                  placeholder="Enter your full name"
                  required
                  minLength={2}
                  maxLength={100}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>
              <label>
                Email address
                <Input
                  type="email"
                  placeholder="you@example.com"
                  required
                  maxLength={254}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>
              <label>
                New password
                <PasswordInput
                  aria-label="New password"
                  placeholder="Leave blank to keep your password"
                  autoComplete="new-password"
                  minLength={12}
                  maxLength={128}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </label>
              <label>
                Confirm new password
                <PasswordInput
                  aria-label="Confirm new password"
                  placeholder="Re-enter your new password"
                  autoComplete="new-password"
                  required={!!password}
                  minLength={12}
                  maxLength={128}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </label>
            </div>
            {sensitive && (
              <label>
                Current password
                <PasswordInput
                  aria-label="Current password"
                  placeholder="Enter your current password to confirm changes"
                  autoComplete="current-password"
                  required
                  maxLength={128}
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                />
              </label>
            )}
            <p className="muted">
              Email or password changes require your current password and sign you out of all
              sessions. A changed email needs verification.
            </p>
            <div className="button-row">
              <Button disabled={save.isPending || uploading}>Save profile</Button>
              <Button
                type="button"
                variant="outline"
                disabled={save.isPending || uploading}
                onClick={() => {
                  resetFields()
                  setEditing(false)
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <dl className="profile-read-fields">
            <div>
              <dt>Full name</dt>
              <dd>{user?.name}</dd>
            </div>
            <div>
              <dt>Email address</dt>
              <dd>{user?.email}</dd>
            </div>
            <div>
              <dt>Password</dt>
              <dd>{'\u2022'.repeat(12)}</dd>
            </div>
            <div>
              <dt>Access</dt>
              <dd>
                {user?.role === 'librarian'
                  ? 'Librarian / staff'
                  : user?.role === 'admin'
                    ? 'Administrator'
                    : 'Member'}
              </dd>
            </div>
          </dl>
        )}
        <div className="profile-verification">
          <span className="muted">
            Email: {user?.emailVerified ? 'Verified' : 'Not yet verified'}
          </span>
          {!user?.emailVerified && (
            <Button
              type="button"
              variant="outline"
              disabled={verify.isPending}
              onClick={() => verify.mutate()}
            >
              Send verification email
            </Button>
          )}
        </div>
      </section>
    </>
  )
}
