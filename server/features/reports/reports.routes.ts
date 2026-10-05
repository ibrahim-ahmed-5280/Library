import { inventoryCsv, overdueCsv, activityCsv } from './exports.controller.js'
import express from 'express'
import { authenticate, authorize } from '../../shared/middleware/auth.js'
import { getReports } from './reports.controller.js'
const router = express.Router()
router.use(authenticate, authorize('librarian', 'admin'))
router.get('/inventory.csv', inventoryCsv)
router.get('/overdue.csv', overdueCsv)
router.get('/loans.csv', activityCsv)
router.get('/reservations.csv', activityCsv)
router.get('/', getReports)
export default router
