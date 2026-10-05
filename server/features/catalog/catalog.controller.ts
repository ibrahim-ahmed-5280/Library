import type { RequestHandler } from 'express'
import { z } from 'zod'
import { requireRecord } from '../../shared/errors.js'
import { Book } from '../inventory/book.model.js'
import { Copy } from '../inventory/copy.model.js'
import { idSchema } from '../../contracts/schemas.js'

export const getList: RequestHandler = async (req, res) => {
  const query = z
    .object({
      q: z.string().max(100).default(''),
      genre: z.string().max(80).default(''),
      sort: z.enum(['title', 'newest']).default('title'),
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(100).default(12),
      available: z.enum(['true', 'false']).optional(),
    })
    .parse(req.query)
  const escaped = query.q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const filter: Record<string, unknown> = { archived: false }
  if (escaped)
    filter.$or = ['title', 'author', 'isbn'].map((field) => ({
      [field]: { $regex: escaped, $options: 'i' },
    }))
  if (query.genre) filter.genre = query.genre
  if (query.available === 'true')
    filter._id = { $in: await Copy.distinct('book', { status: 'available' }) }
  const [books, total, genres] = await Promise.all([
    Book.find(filter)
      .sort(query.sort === 'newest' ? { year: -1, title: 1 } : { title: 1 })
      .skip((query.page - 1) * query.limit)
      .limit(query.limit)
      .lean(),
    Book.countDocuments(filter),
    Book.distinct('genre', { archived: false }),
  ])
  const counts = await Copy.aggregate([
    { $match: { book: { $in: books.map((book) => book._id) }, status: { $ne: 'retired' } } },
    {
      $group: {
        _id: '$book',
        total: { $sum: 1 },
        available: { $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] } },
      },
    },
  ])
  res.json({
    items: books.map((book) => ({
      ...book,
      copies: counts.find((count) => String(count._id) === String(book._id)) ?? {
        total: 0,
        available: 0,
      },
    })),
    total,
    genres,
    page: query.page,
    pages: Math.ceil(total / query.limit),
  })
}

export const getId: RequestHandler = async (req, res) => {
  const book = requireRecord(
    await Book.findOne({ _id: idSchema.parse(req.params.id), archived: false }).lean(),
  )
  const copies = await Copy.find({ book: book._id, status: { $ne: 'retired' } }).lean()
  res.json({
    ...book,
    copies: {
      total: copies.length,
      available: copies.filter((copy) => copy.status === 'available').length,
    },
    inventory: copies,
  })
}
