import { forwardRef } from 'react'
import { cn } from '../../utils/cn.js'

const Input = forwardRef(function Input(
  { label, id, icon: Icon, className, wrapperClassName, ...props },
  ref,
) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={cn('relative', wrapperClassName)}>
      {label ? (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold">
          {label}
        </label>
      ) : null}

      <div className="relative">
        {Icon ? (
          <Icon
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-navy/50 dark:text-cream/50"
            aria-hidden="true"
          />
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={cn('input-shell', Icon ? 'pl-10' : '', className)}
          {...props}
        />
      </div>
    </div>
  )
})

export default Input
