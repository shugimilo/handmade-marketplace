import express from "express"
import authenticationMiddleware from "../middleware/authenticationMiddleware.js"
import { deleteReview, getAllReviews } from "../controllers/reviewController.js"
import { authorizeAdmin } from "../middleware/authorizationMiddleware.js"

const router = express.Router()

router.use(authenticationMiddleware)

router.get("/", getAllReviews)

router.delete("/:id", authorizeAdmin, deleteReview)

export default router