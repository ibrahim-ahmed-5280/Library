import { Loader2 } from 'lucide-react'

export function Loading() {
  return (
    <div className="state" role="status">
      <Loader2 className="spin" size={24} /> Loading library data...
    </div>
  )
}
