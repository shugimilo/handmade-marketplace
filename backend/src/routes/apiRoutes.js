import express from 'express'
import authRoutes from './authRoutes.js'
import userRoutes from './userRoutes.js'
import itemRoutes from './itemRoutes.js'
import categoryRoutes from './categoryRoutes.js'
import favoriteRoutes from './favoriteRoutes.js'
import reviewRoutes from './reviewRoutes.js'
import orderRoutes from './orderRoutes.js'
import cartRoutes from './cartRoutes.js'
import paymentRoutes from './paymentRoutes.js'
import shippingAddressRoutes from './shippingAddressRoutes.js'
import searchRoutes from "./searchRoutes.js"

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/items', itemRoutes)
router.use('/categories', categoryRoutes)
router.use('/favorites', favoriteRoutes)
router.use('/reviews', reviewRoutes)
router.use('/orders', orderRoutes)
router.use('/cart', cartRoutes)
router.use('/payments', paymentRoutes)
router.use('/shipping-addresses', shippingAddressRoutes)
router.use("/search", searchRoutes)

export default router