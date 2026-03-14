import express from "express"
import authenticationMiddleware from "../middleware/authenticationMiddleware.js"
import { deleteReview } from "../controllers/reviewController.js"

const router = express.Router()

router.use(authenticationMiddleware)

router.delete("/:id", deleteReview)

export default router