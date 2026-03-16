import express from "express"

import authenticationMiddleware from "../middleware/authenticationMiddleware.js"
import { lightAuthMiddleware } from "../middleware/authenticationMiddleware.js"
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

router.post("/", authenticationMiddleware, createItem)
router.post("/:id/reviews", authenticationMiddleware, createReview)
router.put("/:id", authenticationMiddleware, authorizeItemOwnerOrAdmin, updateItem)
router.delete("/:id", authenticationMiddleware, authorizeItemOwnerOrAdmin, deleteItem)

router.post(
    "/:itemId/images",
    authenticationMiddleware,
    uploadItemImageMiddleware.single("image"),
    uploadItemImage
)

router.delete(
    "/:itemId/images/:id",
    authenticationMiddleware,
    deleteItemImage
)

export default router