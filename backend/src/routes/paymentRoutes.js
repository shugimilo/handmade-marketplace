import express from "express"
import authenticationMiddleware from "../middleware/authenticationMiddleware.js"
import { createPayment } from "../controllers/paymentController.js"

const router = express.Router()

router.use(authenticationMiddleware)

router.post("/", createPayment)

export default router