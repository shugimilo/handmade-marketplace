import express from "express"

import {
    getAllCategories,
    getCategoryItems,
    createCategory,
    deleteCategory
} from "../controllers/categoryController.js"

import { authorizeAdmin } from "../middleware/authorizationMiddleware.js"
import authenticationMiddleware from "../middleware/authenticationMiddleware.js"

const router = express.Router()

router.get("/", getAllCategories)
router.get("/:id/items", getCategoryItems)

router.post("/", authenticationMiddleware, authorizeAdmin, createCategory)
router.delete("/:id", authenticationMiddleware, authorizeAdmin, deleteCategory)

export default router