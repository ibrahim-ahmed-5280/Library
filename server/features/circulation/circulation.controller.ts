import { pagination, sendPage } from '../../shared/pagination.js'
import type { RequestHandler } from 'express'
import { z } from 'zod'
import { Loan } from './loan.model.js'
import { idSchema } from '../../contracts/schemas.js'
import { issueLoan, renewLoan, returnLoan } from './circulation.service.js'

export const getList: RequestHandler = async (req, res) => {
  const page = pagination(req, 250)
  const filter = {
    ...(req.user!.role === 'member' || req.query.scope === 'mine' ? { member: req.user!.id } : {}),
    ...(req.query.status === 'active'
      ? { returnedAt: null }
      : req.query.status === 'overdue'
        ? { returnedAt: null, dueAt: { $lt: new Date() } }
        : {}),
  }
  const [items, total] = await Promise.all([
    Loan.find(filter)
      .populate('book', 'title author')
      .populate('member', 'name email')
      .populate('copy', 'barcode shelf')
      .sort({ createdAt: -1, _id: -1 })
      .skip(page.skip)
      .limit(page.limit)
      .lean(),
    Loan.countDocuments(filter),
  ])
  sendPage(res, items, total, page)
}

export const postList: RequestHandler = async (req, res) => {
  const input = z.object({ memberId: idSchema, copyId: idSchema }).parse(req.body)
  res.status(201).json(await issueLoan(input.memberId, input.copyId, req.user!.id))
}

export const postIdReturn: RequestHandler = async (req, res) =>
  res.json(await returnLoan(idSchema.parse(req.params.id), req.user!.id))

export const postIdRenew: RequestHandler = async (req, res) =>
  res.json(
    await renewLoan(idSchema.parse(req.params.id), req.user!.id, req.user!.role === 'member'),
  )
