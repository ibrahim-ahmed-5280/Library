import { useState } from 'react'
import { useAction } from '../../../shared/hooks/useAction'
import { Input } from '../../../shared/components/primitives/input'
import { Button } from '../../../shared/components/primitives/button'
import { PasswordInput } from '../../auth/components/PasswordInput'

export default function EmailConfiguration({
  transport,
  sender,
  passwordConfigured,
}: {
  transport: string
  sender: string
  passwordConfigured: boolean
}) {
  const [mode, setMode] = useState(transport)
  const [user, setUser] = useState(sender)
  const [password, setPassword] = useState('')
  const save = useAction('/staff/email/configuration', 'PUT', () => setPassword(''))
  const test = useAction('/staff/email/configuration/test')
  return (
    <details className="email-setup">
      <summary>Configure Gmail delivery</summary>
      <form
        className="form-stack"
        onSubmit={(event) => {
          event.preventDefault()
          save.mutate({ transport: mode, user, ...(password ? { password } : {}) })
        }}
      >
        <label>
          Delivery mode
          <select value={mode} onChange={(event) => setMode(event.target.value)}>
            <option value="preview">Local preview</option>
            <option value="smtp">Gmail SMTP</option>
          </select>
        </label>
        <label>
          Gmail sender address
          <Input
            type="email"
            placeholder="your.name@gmail.com"
            required
            maxLength={254}
            autoComplete="off"
            value={user}
            onChange={(event) => setUser(event.target.value)}
          />
        </label>
        <label>
          Gmail app password
          <PasswordInput
            aria-label="Gmail app password"
            placeholder={
              passwordConfigured
                ? 'Leave blank to keep the saved app password'
                : 'Enter your Google app password'
            }
            autoComplete="new-password"
            maxLength={256}
            required={mode === 'smtp' && (!passwordConfigured || user !== sender)}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <p className="muted">
          Use a Google app password, not your regular Gmail password. Settings are saved to the
          server’s local environment file and applied immediately. Saved passwords are never
          displayed.
        </p>
        <Button disabled={save.isPending}>Save email configuration</Button>
        <Button
          type="button"
          variant="outline"
          disabled={test.isPending || transport !== 'smtp'}
          onClick={() => test.mutate()}
        >
          {test.isPending ? 'Checking Gmail…' : 'Test saved Gmail connection'}
        </Button>
      </form>
    </details>
  )
}
