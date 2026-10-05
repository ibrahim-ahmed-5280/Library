import { toast } from 'sonner'
import { Input } from '../../../shared/components/primitives/input'
import { PasswordInput } from '../components/PasswordInput'
import { Button } from '../../../shared/components/primitives/button'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { loginSchema, registerSchema } from '../../../../server/contracts/schemas'
import { useAuth } from '../providers/AuthProvider'
import { Loading } from '../../../shared/components/ui'
import { BookOpen } from 'lucide-react'
import '../styles/auth.css'

export default function Login() {
  const { user, loading, signIn } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const registering = location.pathname === '/register'
  const schema = registering
    ? registerSchema
        .extend({ confirmPassword: z.string() })
        .refine((values) => values.password === values.confirmPassword, {
          path: ['confirmPassword'],
          message: 'Passwords do not match.',
        })
    : loginSchema.extend({ name: z.string().optional(), confirmPassword: z.string().optional() })
  const form = useForm<{
    email: string
    password: string
    name?: string
    confirmPassword?: string
  }>({
    resolver: zodResolver(schema),
  })
  if (loading) return <Loading />
  if (user)
    return (
      <Navigate
        to={location.state?.from ?? (user.role === 'member' ? '/account' : '/staff')}
        replace
      />
    )
  return (
    <div className="auth-screen">
      <section className={`auth-card${registering ? ' auth-card-register' : ''}`}>
        <div className="auth-mark" aria-hidden="true">
          <BookOpen size={25} />
        </div>
        <h1>{registering ? 'Become a member' : 'Welcome back'}</h1>
        <p className="muted">
          {registering
            ? 'Create your personal library account.'
            : 'Sign in to your library account.'}
        </p>
        <form
          className="form-stack"
          onSubmit={form.handleSubmit(async (values) => {
            try {
              await signIn(
                { name: values.name, email: values.email, password: values.password },
                registering,
              )
              toast.success(
                registering ? 'Your member account is ready.' : 'Signed in successfully.',
              )
            } catch (err) {
              toast.error((err as Error).message, { duration: 7000 })
            }
          })}
        >
          <div className={registering ? 'auth-fields auth-fields-register' : 'auth-fields'}>
            {registering && (
              <label>
                Full name
                <Input
                  placeholder="Enter your full name"
                  autoComplete="name"
                  {...form.register('name')}
                />
                {form.formState.errors.name && (
                  <span className="form-error">{form.formState.errors.name.message}</span>
                )}
              </label>
            )}
            <label>
              Email address
              <Input
                placeholder="you@example.com"
                type="email"
                autoComplete="email"
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <span className="form-error">{form.formState.errors.email.message}</span>
              )}
            </label>
            <label>
              Password
              <PasswordInput
                placeholder={
                  registering ? 'Create a password (at least 12 characters)' : 'Enter your password'
                }
                aria-label="Password"
                autoComplete={registering ? 'new-password' : 'current-password'}
                {...form.register('password')}
              />
              {registering && <small className="muted">Use at least 12 characters.</small>}
              {form.formState.errors.password && (
                <span className="form-error">{form.formState.errors.password.message}</span>
              )}
            </label>
            {registering && (
              <label>
                Confirm password
                <PasswordInput
                  placeholder="Re-enter your password"
                  aria-label="Confirm password"
                  autoComplete="new-password"
                  {...form.register('confirmPassword')}
                />
                {form.formState.errors.confirmPassword && (
                  <span className="form-error">
                    {form.formState.errors.confirmPassword.message}
                  </span>
                )}
              </label>
            )}
          </div>
          {!registering && (
            <Link className="text-link auth-forgot" to="/forgot-password">
              Forgot password?
            </Link>
          )}
          <Button className="button" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? 'Please wait...'
              : registering
                ? 'Create account'
                : 'Sign in'}
          </Button>
        </form>
        <p className="auth-switch">
          {registering ? 'Already a member?' : 'New to the library?'}{' '}
          <button
            className="text-link"
            onClick={() => {
              navigate(registering ? '/login' : '/register', { state: location.state })
              form.reset()
            }}
          >
            {registering ? 'Sign in' : 'Create an account'}
          </button>
        </p>
      </section>
    </div>
  )
}
