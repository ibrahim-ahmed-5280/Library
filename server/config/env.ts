import dotenv from 'dotenv'
import { fileURLToPath } from 'node:url'

// Always load server configuration, regardless of the terminal working directory.
dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)), quiet: true })
import { z } from 'zod'

const environment = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  MONGODB_URI: z.string().default('mongodb://127.0.0.1:27018/biblioteca?replicaSet=biblioteca-rs'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must contain at least 32 characters'),
  MAIL_TRANSPORT: z.enum(['preview', 'smtp']).default('preview'),
  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.coerce.number().default(465),
  SMTP_USER: z.string().default(''),
  SMTP_PASSWORD: z.string().default(''),
  CLIENT_ORIGIN: z.string().url().default('http://localhost:5173'),
})
export const config = environment.parse(process.env)
