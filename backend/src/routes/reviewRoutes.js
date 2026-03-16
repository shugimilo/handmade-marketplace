import express from "express"
import authenticationMiddleware from "../middleware/authenticationMiddleware.js"
import { deleteReview, getAllReviews } from "../controllers/reviewController.js"

const router = express.Router()

router.use(authenticationMiddleware)

router.get("/", getAllReviews)

router.delete("/:id", deleteReview)

export default router