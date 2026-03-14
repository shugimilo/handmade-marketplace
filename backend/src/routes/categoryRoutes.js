import express from "express"
import {
    getAllCategories,
    getCategoryItems
} from "../controllers/categoryController.js"

const router = express.Router()

router.get("/", getAllCategories)
router.get("/:id/items", getCategoryItems)

export default router