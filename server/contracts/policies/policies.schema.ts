import { z } from 'zod'
export const policySchema = z.object({
  loanDays: z.coerce.number().int().min(1).max(90),
  maxLoans: z.coerce.number().int().min(1).max(50),
  maxRenewals: z.coerce.number().int().min(0).max(10),
  renewalDays: z.coerce.number().int().min(1).max(90),
})
export type PolicyInput = z.infer<typeof policySchema>
