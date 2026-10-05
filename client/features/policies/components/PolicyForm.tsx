import { useAction } from '../../../shared/hooks/useAction'
import { Input } from '../../../shared/components/primitives/input'
import { Button } from '../../../shared/components/primitives/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { policySchema, type PolicyInput } from '../../../../server/contracts/schemas'
import { MutationFeedback } from '../../../shared/components/ui'

export default function PolicyForm({ policy }: { policy: PolicyInput }) {
  const form = useForm<PolicyInput>({ resolver: zodResolver(policySchema), defaultValues: policy })
  const action = useAction('/staff/policies', 'PUT')
  return (
    <form className="form-stack" onSubmit={form.handleSubmit((values) => action.mutate(values))}>
      <div className="form-grid">
        {[
          {
            key: 'loanDays',
            label: 'Initial loan period (days)',
            help: 'Due dates for newly issued loans.',
          },
          { key: 'maxLoans', label: 'Maximum active loans', help: 'Borrowing limit per member.' },
          { key: 'maxRenewals', label: 'Maximum renewals', help: 'Number of renewals per loan.' },
          {
            key: 'renewalDays',
            label: 'Renewal extension (days)',
            help: 'Days added to the current due date.',
          },
        ].map(({ key, label, help }) => (
          <label key={key}>
            {label}
            <Input
              placeholder={
                key === 'loanDays' || key === 'renewalDays'
                  ? 'Enter the number of days'
                  : 'Enter the permitted count'
              }
              type="number"
              {...form.register(key as keyof PolicyInput, { valueAsNumber: true })}
            />
            <small className="muted">{help}</small>
            {form.formState.errors[key as keyof PolicyInput] && (
              <span className="form-error">
                {form.formState.errors[key as keyof PolicyInput]?.message}
              </span>
            )}
          </label>
        ))}
      </div>
      <p className="muted">
        Existing due dates stay as issued. Overdue books and waiting reservations prevent renewals.
      </p>
      <MutationFeedback error={action.error} success={action.isSuccess} />
      <Button className="button" disabled={action.isPending}>
        Save loan policies
      </Button>
    </form>
  )
}
