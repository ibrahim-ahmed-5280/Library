import { usePagedList } from '../../../shared/hooks/usePagedList'
import Pagination from '../../../shared/components/Pagination'
import { useState } from 'react'
import { useAction } from '../../../shared/hooks/useAction'
import { Button } from '../../../shared/components/primitives/button'
import { Loading, ErrorState, Empty, MutationFeedback } from '../../../shared/components/ui'
interface Message {
  _id: string
  name: string
  email: string
  subject: string
  message: string
  status: 'new' | 'handled'
  createdAt: string
}
function MessageCard({ item }: { item: Message }) {
  const [reply, setReply] = useState('')
  const replyAction = useAction(`/staff/contact/${item._id}/reply`, 'POST', () => setReply(''))
  const action = useAction(`/staff/contact/${item._id}`, 'PATCH')
  return (
    <article className="panel contact-message">
      <div className="section-heading">
        <h2>{item.subject}</h2>
        <span className="muted">{item.status === 'new' ? 'New message' : 'Handled'}</span>
      </div>
      <p>
        <strong>{item.name}</strong> ?{' '}
        <a className="text-link" href={`mailto:${item.email}`}>
          {item.email}
        </a>
      </p>
      <small className="muted">{new Date(item.createdAt).toLocaleString()}</small>
      <p className="contact-message-body">{item.message}</p>
      <Button
        variant="outline"
        disabled={action.isPending}
        onClick={() => action.mutate({ status: item.status === 'new' ? 'handled' : 'new' })}
      >
        {item.status === 'new' ? 'Mark as handled' : 'Reopen message'}
      </Button>
      <details className="contact-reply">
        <summary>Reply by email</summary>
        <form
          className="form-stack"
          onSubmit={(event) => {
            event.preventDefault()
            replyAction.mutate({ message: reply })
          }}
        >
          <label>
            Reply
            <textarea
              rows={4}
              value={reply}
              onChange={(event) => setReply(event.target.value)}
              minLength={10}
              maxLength={3000}
              placeholder="Write your reply to the sender"
              required
            />
          </label>
          <Button disabled={replyAction.isPending}>Queue email reply</Button>
        </form>
      </details>
      <MutationFeedback error={action.error} />
    </article>
  )
}
export default function ContactMessagesPage() {
  const messages = usePagedList<Message>('contact-messages', '/staff/contact')
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">LIBRARY INBOX</p>
          <h1>Contact messages</h1>
          <p className="muted">
            All contact messages. Use the sender?s email to reply, then mark the request as handled.
          </p>
        </div>
      </div>
      {messages.isPending ? (
        <Loading />
      ) : messages.error ? (
        <ErrorState error={messages.error} />
      ) : messages.data.length ? (
        <div className="contact-message-list">
          {messages.data.map((item) => (
            <MessageCard key={item._id} item={item} />
          ))}
        </div>
      ) : (
        <Empty title="No contact messages yet" />
      )}
      <Pagination {...messages} />
    </>
  )
}
