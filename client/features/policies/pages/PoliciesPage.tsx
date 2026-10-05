import { useQuery } from '@tanstack/react-query'
import { api } from '../../../shared/lib/api'
import type { PolicyInput } from '../../../../server/contracts/schemas'
import { ErrorState, Loading, PageHeading } from '../../../shared/components/ui'
import PolicyForm from '../components/PolicyForm'

export default function PoliciesPage() {
  const policy = useQuery({
    queryKey: ['policies'],
    queryFn: () => api<PolicyInput>('/staff/policies'),
  })
  return (
    <>
      <PageHeading
        eyebrow="LIBRARY SETTINGS"
        title="Loan policies"
        description="Set clear borrowing rules for your library. Administrator access is required."
      />
      <section className="panel policy-panel">
        <h2>Borrowing & renewal rules</h2>
        {policy.isPending ? (
          <Loading />
        ) : policy.error ? (
          <ErrorState error={policy.error} />
        ) : (
          <PolicyForm policy={policy.data} />
        )}
      </section>
    </>
  )
}
