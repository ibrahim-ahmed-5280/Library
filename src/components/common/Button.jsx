import { cn } from '../../utils/cn.js'

const variantStyles = {
  primary: 'btn-primary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
}

function Button({
  as: Component = 'button',
  variant = 'primary',
  className,
  children,
  ...props
}) {
  const classes = cn(variantStyles[variant] ?? variantStyles.primary, className)

  if (Component === 'button') {
    return (
      <button type="button" className={classes} {...props}>
        {children}
      </button>
    )
  }

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  )
}

export default Button
