import { cn } from '../../utils/cn.js'

function Card({ as: Component = 'div', className, children, ...props }) {
  return (
    <Component className={cn('surface-card', className)} {...props}>
      {children}
    </Component>
  )
}

export default Card
