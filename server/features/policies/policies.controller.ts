import type { RequestHandler } from 'express'
import mongoose from 'mongoose'
import { Audit } from '../audit/audit.model.js'

import { Policy } from './policy.model.js'

import { getPolicy } from './policy.model.js'
import { policySchema } from '../../contracts/schemas.js'

export const getPolicies: RequestHandler = async (_req, res) => res.json(await getPolicy())

export const putPolicies: RequestHandler = async (req, res) => {
  const input = policySchema.parse(req.body)
  const policy = await mongoose.connection.transaction(async (session) => {
    const updated = await Policy.findOneAndUpdate({ key: 'library' }, input, {
      upsert: true,
      returnDocument: 'after',
      session,
    })
    await Audit.create([{ actor: req.user!.id, action: 'policy.updated', entity: 'library' }], {
      session,
    })
    return updated
  })
  res.json(policy)
}
