import express from 'express'
import { createItem, getItemById, getItems } from '../controllers/itemController.js'

const router = express.Router()

// GET Routes
router.get('/', getItems)
router.get('/:id', getItemById)

// POST Routes
router.post('/', createItem)

export default router