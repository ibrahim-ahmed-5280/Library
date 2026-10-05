export function Status({ value }: { value: string }) {
  return (
    <span
      className={`status ${['active', 'available', 'returned', 'fulfilled'].includes(value) ? 'good' : ['overdue', 'suspended', 'retired'].includes(value) ? 'bad' : ''}`}
    >
      {value.replaceAll('_', ' ')}
    </span>
  )
}
