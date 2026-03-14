import express from "express"
import authenticationMiddleware from "../middleware/authenticationMiddleware.js"

import {
    markItemAsFavorite,
    unmarkItemAsFavorite
} from "../controllers/favoriteController.js"

const router = express.Router()

router.use(authenticationMiddleware)

router.post("/:id", markItemAsFavorite)
router.delete("/:id", unmarkItemAsFavorite)

export default router