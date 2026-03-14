import express from "express"
import authMiddleware from "../middleware/authenticationMiddleware.js"

import {
    getUserCart,
    addItemToCart,
    deleteItemFromCart,
    decreaseCartItemQuantity,
    emptyCart
} from "../controllers/cartController.js"

const router = express.Router()

router.use(authMiddleware)

router.get("/", getUserCart)
router.post("/items", addItemToCart)
router.patch("/items/:id/decrease", decreaseCartItemQuantity)
router.delete("/items/:id", deleteItemFromCart)
router.delete("/", emptyCart)

export default router