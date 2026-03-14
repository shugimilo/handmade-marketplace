import express from "express"
import authenticationMiddleware from "../middleware/authenticationMiddleware.js"

import {
    createShippingAddress,
    getUserShippingAddresses,
    getShippingAddressFull,
    updateShippingAddress,
    deleteShippingAddress
} from "../controllers/shippingAddressController.js"

const router = express.Router()

router.use(authenticationMiddleware)

router.post("/", createShippingAddress)
router.get("/", getUserShippingAddresses)
router.get("/:id", getShippingAddressFull)
router.put("/:id", updateShippingAddress)
router.delete("/:id", deleteShippingAddress)

export default router