import { api } from '../../../shared/lib/api'
import type { User } from '../../../shared/types'
import { toast } from 'sonner'
import { useAuth } from '../providers/AuthProvider'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { useAction } from '../../../shared/hooks/useAction'
import { PasswordInput } from '../components/PasswordInput'
import { Input } from '../../../shared/components/primitives/input'
import { Button } from '../../../shared/components/primitives/button'
import '../styles/auth.css'
export default function RecoveryPage() {
  const location = useLocation(),
    [params] = useSearchParams()
  const reset = location.pathname === '/reset-password',
    verify = location.pathname === '/verify-email'
  const { user, updateUser, signOut } = useAuth()
  const token = params.get('token') ?? ''
  const RecoveryInput = reset ? PasswordInput : Input
  const action = useAction(
    verify ? '/auth/verify-email' : reset ? '/auth/reset-password' : '/auth/forgot-password',
    'POST',
    () => {
      if (verify && user)
        void api<User>('/me')
          .then(updateUser)
          .catch(() => {})
      if (reset) void signOut().catch(() => {})
    },
  )
  return (
    <div className="auth-screen">
      <section className="auth-card">
        <div className="auth-mark">
          <BookOpen size={25} />
        </div>
        <h1>
          {verify ? 'Verify your email' : reset ? 'Choose a new password' : 'Reset your password'}
        </h1>
        <p className="muted">
          {verify
            ? 'Confirm the email address associated with your library account.'
            : reset
              ? 'Choose a unique password of at least 12 characters.'
              : 'Enter your account email. If it matches an active account, we will queue a reset link.'}
        </p>
        {action.isSuccess ? (
          <p className="recovery-result" role="status">
            {verify
              ? 'Your email is verified.'
              : reset
                ? 'Password updated. Sign in with your new password.'
                : 'If an active account matches, a reset link has been queued. Check your email.'}
          </p>
        ) : (reset || verify) && !token ? (
          <p className="form-error">This link is incomplete. Request a new link.</p>
        ) : (
          <form
            className="form-stack"
            onSubmit={(event) => {
              event.preventDefault()
              const data = new FormData(event.currentTarget)
              if (reset && data.get('password') !== data.get('confirmPassword')) {
                toast.error('Passwords do not match.')
                return
              }
              action.mutate(
                verify
                  ? { token }
                  : reset
                    ? { token, password: data.get('password') }
                    : { email: data.get('email') },
              )
            }}
          >
            {!verify && (
              <label>
                {reset ? 'New password' : 'Email address'}
                <RecoveryInput
                  aria-label={reset ? 'New password' : 'Email address'}
                  name={reset ? 'password' : 'email'}
                  type={reset ? 'password' : 'email'}
                  autoComplete={reset ? 'new-password' : 'email'}
                  minLength={reset ? 12 : undefined}
                  maxLength={reset ? 128 : 254}
                  placeholder={reset ? 'Create a new password' : 'you@example.com'}
                  required
                />
              </label>
            )}
            {reset && (
              <label>
                Confirm new password
                <PasswordInput
                  aria-label="Confirm new password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Enter the new password again"
                  autoComplete="new-password"
                  required
                  minLength={12}
                  maxLength={128}
                />
              </label>
            )}
            <Button disabled={action.isPending}>
              {action.isPending
                ? 'Please wait...'
                : verify
                  ? 'Verify email'
                  : reset
                    ? 'Update password'
                    : 'Send reset link'}
            </Button>
          </form>
        )}
        <p className="auth-switch">
          <Link className="text-link" to="/login">
            Back to sign in
          </Link>
        </p>
      </section>
    </div>
  )
}
