import { getList, getId } from './catalog.controller.js'
import express from 'express'

const router = express.Router()
router.get('/', getList)
router.get('/:id', getId)

export default router
