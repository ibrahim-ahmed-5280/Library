import { useState } from 'react'
import { Download } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '../../../shared/components/primitives/input'
import { Button } from '../../../shared/components/primitives/button'
import { downloadReport } from '../../../shared/lib/download'

export default function ExportPanel() {
  const [kind, setKind] = useState('loans')
  const [status, setStatus] = useState('all')
  const [dateField, setDateField] = useState('createdAt')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [q, setQ] = useState('')
  const [busy, setBusy] = useState(false)
  const statuses =
    kind === 'inventory'
      ? ['all', 'available', 'on_loan', 'retired']
      : kind === 'reservations'
        ? ['all', 'waiting', 'fulfilled', 'cancelled']
        : kind === 'overdue'
          ? ['all']
          : ['all', 'active', 'returned', 'overdue']
  return (
    <section className="panel report-export-panel">
      <div className="section-heading">
        <div>
          <h2>Filtered exports</h2>
          <p className="muted">All matching records. Optional dates use UTC.</p>
        </div>
      </div>
      <form
        className="form-stack export-fields"
        onSubmit={(event) => {
          event.preventDefault()
          if (from && to && from > to) {
            toast.error('The start date must be on or before the end date.')
            return
          }
          const params = new URLSearchParams({
            status,
            dateField,
            ...(from ? { from } : {}),
            ...(to ? { to } : {}),
            ...(q ? { q } : {}),
          })
          setBusy(true)
          void downloadReport(`/staff/reports/${kind}.csv?${params}`, `${kind}-report.csv`)
            .then(() => toast.success('Report exported.'))
            .catch((error) => toast.error(error.message))
            .finally(() => setBusy(false))
        }}
      >
        <label>
          Report
          <select
            value={kind}
            onChange={(event) => {
              setKind(event.target.value)
              setStatus('all')
              setDateField('createdAt')
            }}
          >
            <option value="loans">All loans / borrowing history</option>
            <option value="overdue">Overdue loans</option>
            <option value="reservations">Reservations</option>
            <option value="inventory">Inventory / copies</option>
          </select>
        </label>
        <label>
          Status
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item.replaceAll('_', ' ')}
              </option>
            ))}
          </select>
        </label>
        <label>
          Date applies to
          <select value={dateField} onChange={(event) => setDateField(event.target.value)}>
            <option value="createdAt">
              {kind === 'inventory'
                ? 'Copy added'
                : kind === 'reservations'
                  ? 'Reservation requested'
                  : 'Loan issued'}
            </option>
            {['loans', 'overdue'].includes(kind) && (
              <>
                <option value="dueAt">Due date</option>
                <option value="returnedAt">Return date</option>
              </>
            )}
          </select>
        </label>
        <label>
          From date
          <Input
            type="date"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
            max={to || undefined}
          />
        </label>
        <label>
          To date
          <Input
            type="date"
            value={to}
            onChange={(event) => setTo(event.target.value)}
            min={from || undefined}
          />
        </label>
        <label>
          Search filter
          <Input
            placeholder={
              kind === 'inventory'
                ? 'Title, author, ISBN, barcode, or shelf'
                : 'Title, author, ISBN, member, or email'
            }
            maxLength={100}
            value={q}
            onChange={(event) => setQ(event.target.value)}
          />
        </label>
        <Button disabled={busy}>
          <Download size={17} />
          {busy ? 'Exporting…' : 'Export filtered CSV'}
        </Button>
      </form>
    </section>
  )
}
