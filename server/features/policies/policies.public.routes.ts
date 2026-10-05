import { Router } from 'express'
import { getPolicy } from './policy.model.js'

const router = Router()
router.get('/', async (_req, res) => {
  const policy = await getPolicy()
  res.json({
    loanDays: policy.loanDays,
    maxLoans: policy.maxLoans,
    maxRenewals: policy.maxRenewals,
    renewalDays: policy.renewalDays,
  })
})
export default router
