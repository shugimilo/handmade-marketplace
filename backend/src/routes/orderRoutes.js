import express from "express"
import authenticationMiddleware from "../middleware/authenticationMiddleware.js"

import {
    createOrder,
    getUserBuyerOrders,
    getUserSellerOrders
} from "../controllers/orderController.js"

const router = express.Router()

router.use(authenticationMiddleware)

router.post("/", createOrder)
router.get("/buyer", getUserBuyerOrders)
router.get("/seller", getUserSellerOrders)

export default router