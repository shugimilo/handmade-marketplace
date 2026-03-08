import express from 'express';
import userRoutes from './userRoutes.js'
import itemRoutes from './itemRoutes.js'
import categoryRoutes from './categoryRoutes.js'
import favoriteRoutes from './favoriteRoutes.js'
import reviewRoutes from './reviewRoutes.js'
import orderRoutes from './orderRoutes.js'
import cartRoutes from './cartRoutes.js'
import paymentRoutes from './paymentRoutes.js'
import shipAddrRoutes from './shippAddrRoutes.js'

const router = express.Router()

router.use('/users', userRoutes)
router.use('/items', itemRoutes)
// router.use('/categories', categoryRoutes)
// router.use('/favorites', favoriteRoutes)
// router.use('/reviews', reviewRoutes)
// router.use('/orders', orderRoutes)
// router.use('/carts', cartRoutes)
// router.use('/payments', paymentRoutes)
// router.use('/shipping-addresses', shipAddrRoutes)

export default router