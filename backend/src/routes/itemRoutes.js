import express from "express"

import authMiddleware from "../middleware/authenticationMiddleware.js"
import { authorizeItemOwnerOrAdmin } from "../middleware/authorizationMiddleware.js"
import uploadItemImageMiddleware from "../middleware/uploadItemImageMiddleware.js"

import {
    createItem,
    getAllItems,
    getItemById,
    updateItem,
    deleteItem
} from "../controllers/itemController.js"

import {
    uploadItemImage,
    deleteItemImage
} from "../controllers/itemImageController.js"

import { createReview } from "../controllers/reviewController.js"

const router = express.Router()

router.get("/", getAllItems)
router.get("/:id", getItemById)

router.post("/", authMiddleware, createItem)
router.post("/:id/reviews", authenticationMiddleware, createReview)
router.put("/:id", authMiddleware, authorizeItemOwnerOrAdmin, updateItem)
router.delete("/:id", authMiddleware, authorizeItemOwnerOrAdmin, deleteItem)

router.post(
    "/:itemId/images",
    authMiddleware,
    uploadItemImageMiddleware.single("image"),
    uploadItemImage
)

router.delete(
    "/:itemId/images/:id",
    authMiddleware,
    deleteItemImage
)

export default router