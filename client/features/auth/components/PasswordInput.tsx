import { forwardRef, useState, type ComponentProps } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '../../../shared/components/primitives/input'

export const PasswordInput = forwardRef<HTMLInputElement, ComponentProps<'input'>>((props, ref) => {
  const [visible, setVisible] = useState(false)
  return (
    <span className="password-input">
      <Input {...props} ref={ref} type={visible ? 'text' : 'password'} />
      <button
        type="button"
        className="password-toggle"
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        onClick={() => setVisible(!visible)}
      >
        {visible ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}
      </button>
    </span>
  )
})
PasswordInput.displayName = 'PasswordInput'
