import { cn } from '../../utils/cn.js'

const variants = {
  neutral: 'bg-navy/10 text-navy dark:bg-cream/15 dark:text-cream',
  terracotta:
    'bg-terracotta/15 text-terracotta dark:bg-terracotta/25 dark:text-terracotta',
  sage: 'bg-sage/20 text-navy dark:bg-sage/30 dark:text-cream',
}

function Badge({ children, variant = 'neutral', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
        variants[variant] ?? variants.neutral,
        className,
      )}
    >
      {children}
    </span>
  )
}

export default Badge
