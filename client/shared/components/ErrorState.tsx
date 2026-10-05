import { Button } from './primitives/button'
import { AlertCircle } from 'lucide-react'

export function ErrorState({ error, retry }: { error: Error; retry?: () => void }) {
  return (
    <div className="error-state" role="alert">
      <AlertCircle size={22} />
      <p>{error.message}</p>
      {retry && (
        <Button className="button secondary" onClick={retry}>
          Try again
        </Button>
      )}
    </div>
  )
}
