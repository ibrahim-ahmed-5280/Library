import { BookOpen } from 'lucide-react'
import type { ReactNode } from 'react'

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="state empty">
      <BookOpen size={30} />
      <h3>{title}</h3>
      {children}
    </div>
  )
}
