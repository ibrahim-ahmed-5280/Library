import { z } from 'zod'
export const roles = ['member', 'librarian', 'admin'] as const
export const idSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid record ID')
export type Role = (typeof roles)[number]
