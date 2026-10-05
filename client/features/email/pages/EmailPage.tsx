import { useQuery } from '@tanstack/react-query'
import { api } from '../../../shared/lib/api'
import { usePagedList } from '../../../shared/hooks/usePagedList'
import { useAction } from '../../../shared/hooks/useAction'
import Pagination from '../../../shared/components/Pagination'
import { Button } from '../../../shared/components/primitives/button'
import { Loading, ErrorState, PageHeading, Empty } from '../../../shared/components/ui'
import EmailConfiguration from '../components/EmailConfiguration'
interface Mail {
  _id: string
  to: string
  subject: string
  status: string
  attempts: number
  text?: string
  lastError?: string
  createdAt: string
}
function EmailRow({ mail }: { mail: Mail }) {
  const retry = useAction(`/staff/email/${mail._id}/retry`)
  return (
    <article className="panel email-entry">
      <div className="section-heading">
        <div>
          <h2>{mail.subject}</h2>
          <p className="muted">
            {mail.to} | {mail.status} | {new Date(mail.createdAt).toLocaleString()}
          </p>
        </div>
        {['failed', 'preview'].includes(mail.status) && (
          <Button variant="outline" disabled={retry.isPending} onClick={() => retry.mutate()}>
            Retry delivery
          </Button>
        )}
      </div>
      {mail.lastError && <p className="danger-text">{mail.lastError}</p>}
      {mail.text && (
        <details>
          <summary>Local email preview</summary>
          <pre className="email-preview">{mail.text}</pre>
        </details>
      )}
    </article>
  )
}
export default function EmailPage() {
  const emails = usePagedList<Mail>('email-outbox', '/staff/email')
  const status = useQuery({
    queryKey: ['email-status'],
    queryFn: () =>
      api<{ transport: string; configured: boolean; sender: string; passwordConfigured: boolean }>(
        '/staff/email/status',
      ),
  })
  return (
    <>
      <PageHeading
        eyebrow="EMAIL DELIVERY"
        title="Email outbox"
        description="Review verification, recovery, borrowing reminders, and contact replies."
      />
      <div className="panel email-configuration">
        <strong>
          {status.data?.configured
            ? `Gmail credentials configured: ${status.data.sender}`
            : status.data?.transport === 'preview'
              ? 'Local preview mode: no external emails are sent.'
              : 'Gmail credentials are missing: messages wait in the queue.'}
        </strong>
        <p className="muted">
          Configure Gmail below. Delivery runs while the server is running. Preview bodies are
          visible only to administrators in development preview mode.
        </p>
        {status.data && (
          <EmailConfiguration
            key={`${status.data.transport}-${status.data.sender}-${status.data.passwordConfigured}`}
            transport={status.data.transport}
            sender={status.data.sender}
            passwordConfigured={status.data.passwordConfigured}
          />
        )}
      </div>
      {emails.isPending ? (
        <Loading />
      ) : emails.error ? (
        <ErrorState error={emails.error} />
      ) : emails.data.length ? (
        <div className="email-list">
          {emails.data.map((mail) => (
            <EmailRow key={mail._id} mail={mail} />
          ))}
        </div>
      ) : (
        <Empty title="No queued emails yet" />
      )}
      <Pagination {...emails} />
    </>
  )
}
