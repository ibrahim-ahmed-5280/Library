import { useAction } from '../../../shared/hooks/useAction'
import { formatDate } from '../../../shared/lib/date'

import { Button } from '../../../shared/components/primitives/button'

import type { Notification } from '../../../shared/types'
import { MutationFeedback } from '../../../shared/components/ui'

export default function NotificationRow({ item }: { item: Notification }) {
  const markRead = useAction(`/notifications/${item._id}`, 'PATCH')
  return (
    <div className="account-row">
      <div>
        <p>{item.message}</p>
        <small className="muted">{formatDate(item.createdAt)}</small>
        <MutationFeedback error={markRead.error} />
      </div>
      {!item.read && (
        <Button
          className="button secondary"
          disabled={markRead.isPending}
          onClick={() => markRead.mutate(undefined)}
        >
          Mark read
        </Button>
      )}
    </div>
  )
}
