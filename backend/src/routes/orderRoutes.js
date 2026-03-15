import express from "express"
import authenticationMiddleware from "../middleware/authenticationMiddleware.js"
import { authorizeAdmin } from "../middleware/authorizationMiddleware.js"

import {
    createOrder,
    updateOrderStatus,
    getUserBuyerOrders,
    getUserSellerOrders,
    getAllOrders
} from "../controllers/orderController.js"

const router = express.Router()

router.use(authenticationMiddleware)

router.get("/", authenticationMiddleware, authorizeAdmin, getAllOrders)
router.post("/", createOrder)
router.patch("/:id/status", authenticationMiddleware, updateOrderStatus)
router.get("/buyer", getUserBuyerOrders)
router.get("/seller", getUserSellerOrders)

export default router