import { emailRouter } from './features/email/email.routes.js'
import { publicSettingsRouter, adminSettingsRouter } from './features/settings/settings.routes.js'
import { contactRouter, staffContactRouter } from './features/contact/contact.routes.js'
import { publicCovers, staffCovers } from './features/covers/cover.routes.js'
import authRouter from './features/auth/auth.routes.js'
import catalogRouter from './features/catalog/catalog.routes.js'
import accountRouter from './features/account/account.routes.js'
import circulationRouter from './features/circulation/circulation.routes.js'
import reservationsRouter from './features/reservations/reservations.routes.js'
import inventoryRouter from './features/inventory/inventory.routes.js'
import membersRouter from './features/members/members.routes.js'
import reportsRouter from './features/reports/reports.routes.js'
import auditRouter from './features/audit/audit.routes.js'
import policiesRouter from './features/policies/policies.routes.js'
import publicPoliciesRouter from './features/policies/policies.public.routes.js'
import express, { type ErrorRequestHandler } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import mongoose from 'mongoose'
import { ZodError } from 'zod'
import { ApiError } from './shared/errors.js'
import { isTrustedOrigin } from './shared/middleware/trusted-origin.js'

export const app = express()
app.disable('x-powered-by')
app.use(
  helmet(),
  cors({
    origin: (origin, callback) => callback(null, !origin || isTrustedOrigin(origin)),
    credentials: true,
  }),
  express.json({ limit: '100kb' }),
  cookieParser(),
)
app.use('/api', (req, _res, next) => {
  if (
    !['GET', 'HEAD', 'OPTIONS'].includes(req.method) &&
    req.headers.origin &&
    !isTrustedOrigin(req.headers.origin)
  )
    return next(new ApiError(403, 'Untrusted request origin'))
  next()
})
app.get('/api/health', (_req, res) =>
  res
    .status(mongoose.connection.readyState === 1 ? 200 : 503)
    .json({ status: mongoose.connection.readyState === 1 ? 'ok' : 'database_unavailable' }),
)

app.use('/api/library/settings', publicSettingsRouter)
app.use('/api/staff/email', emailRouter)
app.use('/api/staff/settings', adminSettingsRouter)
app.use('/api/contact', contactRouter)
app.use('/api/staff/contact', staffContactRouter)
app.use('/api/covers', publicCovers)
app.use('/api/staff/covers', staffCovers)
app.use('/api/auth', authRouter)
app.use('/api/library/policies', publicPoliciesRouter)
app.use('/api/books', catalogRouter)
app.use('/api', accountRouter)
app.use('/api/loans', circulationRouter)
app.use('/api/reservations', reservationsRouter)
app.use('/api/staff', inventoryRouter)
app.use('/api/staff', membersRouter)
app.use('/api/staff/reports', reportsRouter)
app.use('/api/staff/audit', auditRouter)
app.use('/api/staff/policies', policiesRouter)
app.use((_req, _res, next) => next(new ApiError(404, 'Endpoint not found')))
const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  if (res.headersSent) {
    next(error)
    return
  }
  if (error instanceof ZodError) {
    res.status(400).json({
      message: error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; '),
    })
    return
  }
  if (error instanceof ApiError) {
    res.status(error.status).json({ message: error.message })
    return
  }
  if (error?.code === 11000) {
    res.status(409).json({ message: 'This email, ISBN, barcode, or reservation already exists' })
    return
  }
  if (error?.type === 'entity.too.large') {
    res.status(413).json({
      message: 'The upload or request is too large. Images must be no larger than 5 MB.',
    })
    return
  }
  if (error?.type === 'entity.parse.failed') {
    res.status(400).json({ message: 'Invalid JSON request' })
    return
  }
  console.error(error)
  res.status(500).json({ message: 'An unexpected error occurred. Please try again.' })
}
app.use(errorHandler)
