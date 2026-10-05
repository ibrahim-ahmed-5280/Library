import { cn } from '../../utils/cn.js'

export function Skeleton({ className }) {
  return (
    <div className={cn('animate-pulse rounded-2xl bg-navy/10 dark:bg-cream/10', className)} />
  )
}

export function BookCardSkeleton() {
  return (
    <article className="surface-card min-w-[250px] p-4 sm:min-w-[260px]">
      <Skeleton className="h-44 w-full rounded-2xl" />
      <Skeleton className="mt-4 h-4 w-3/4" />
      <Skeleton className="mt-2 h-4 w-1/2" />
      <Skeleton className="mt-4 h-3 w-24" />
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-9 w-20 rounded-full" />
        <Skeleton className="h-9 w-20 rounded-full" />
      </div>
    </article>
  )
}
