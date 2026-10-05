import { z } from 'zod'
export const bookSchema = z.object({
  coverId: z
    .string()
    .regex(/^[a-f0-9]{24}$/i)
    .nullable()
    .optional(),
  title: z.string().trim().min(1).max(200),
  author: z.string().trim().min(1).max(150),
  isbn: z.string().trim().min(1).max(30),
  genre: z.string().trim().min(1).max(80),
  year: z.coerce
    .number()
    .int()
    .min(1000)
    .max(new Date().getFullYear() + 1),
  description: z.string().trim().max(3000).default(''),
  archived: z.boolean().default(false),
})
export const copySchema = z.object({
  barcode: z.string().trim().min(1).max(80),
  shelf: z.string().trim().min(1).max(80),
})
