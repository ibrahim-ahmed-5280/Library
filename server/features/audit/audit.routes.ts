import express from 'express'
import { authenticate, authorize } from '../../shared/middleware/auth.js'
import { getAudit } from './audit.controller.js'
const router = express.Router()
router.use(authenticate, authorize('librarian', 'admin'))
router.get('/', authorize('admin'), getAudit)
export default router
