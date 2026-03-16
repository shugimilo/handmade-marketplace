import { basicItemInfo } from '../../prisma/selects/basic.select.js'
import { userAsBuyerOrderInfo, userAsSellerOrderInfo } from '../../prisma/selects/order.select.js'
import prisma from '../prismaClient.js'

export async function createOrder(req, res) {
    const userId = Number(req.userId)
    const addressId = Number(req.body.addressId)

    try {

        const cart = await prisma.cart.findFirst({
            where: { userId },
            select: {
                id: true,
                cartItems: {
                    select: {
                        itemId: true,
                        quantity: true,
                        item: {
                            select: {
                                ...basicItemInfo,
                                authorId: true
                            }
                        }
                    }
                }
            }
        })

        if (!cart || cart.cartItems.length === 0) {
            return res.status(400).json({ message: "Cart is empty" })
        }

        const ownItem = cart.cartItems.find(ci => ci.item.authorId === userId);

        if (ownItem) {
            return res.status(400).json({
                message: "You cannot purchase your own item"
            });
        }

        // GROUP ITEMS BY SELLER
        const itemsBySeller = {}

        for (const ci of cart.cartItems) {
            const sellerId = ci.item.authorId

            if (!itemsBySeller[sellerId]) {
                itemsBySeller[sellerId] = []
            }

            itemsBySeller[sellerId].push(ci)
        }

        const orders = await prisma.$transaction(async (tx) => {

            const createdOrders = []

            for (const sellerId in itemsBySeller) {

                const sellerItems = itemsBySeller[sellerId]

                const total = sellerItems.reduce(
                    (sum, ci) => sum + ci.item.price * ci.quantity,
                    0
                )

                const order = await tx.order.create({
                    data: {
                        buyerId: userId,
                        addressId,
                        total,
                        status: "Created",
                        orderItems: {
                            create: sellerItems.map(ci => ({
                                itemId: ci.itemId,
                                priceAtPurchase: ci.item.price,
                                currencyAtPurchase: ci.item.currency,
                                quantity: ci.quantity
                            }))
                        }
                    }
                })

                createdOrders.push(order)
            }

            // CLEAR CART
            await tx.cartItem.deleteMany({
                where: { cartId: cart.id }
            })

            return createdOrders
        })

        res.json({ orders })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export async function updateOrderStatus(req, res) {
    const userId = Number(req.userId)
    const orderId = Number(req.params.id)
    const { status } = req.body

    const allowedStatuses = ["Created", "Paid", "Shipped", "Delivered", "Cancelled"]

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid order status" })
    }

    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                orderItems: {
                    include: {
                        item: {
                            select: { authorId: true }
                        }
                    }
                }
            }
        })

        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }

        // seller ownership check
        const sellerIds = order.orderItems.map(oi => oi.item.authorId)

        if (!sellerIds.includes(userId)) {
            return res.status(403).json({ message: "Action unauthorized" })
        }

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status }
        })

        res.json({ updatedOrder })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export async function getUserBuyerOrders(req, res) {
    const userId = Number(req.userId)

    try {
        const buyerOrders = await prisma.order.findMany({
            where: { buyerId: userId },
            select: userAsBuyerOrderInfo
        })

        res.json({ buyerOrders })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export async function getUserSellerOrders(req, res) {
    const userId = Number(req.userId)

    try {
        const sellerOrders = await prisma.order.findMany({
            where: {
                orderItems: {
                    some: {
                        item: {
                            authorId: userId
                        }
                    }
                }
            },
            select: userAsSellerOrderInfo
        })
        res.json({ sellerOrders })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export async function getAllOrders(req, res) {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 20
    const skip = (page - 1) * limit

    try {
        const [orders, totalOrders] = await Promise.all([
            prisma.order.findMany({
                select: userAsBuyerOrderInfo,
                skip,
                take: limit,
                orderBy: {
                    placedAt: "desc"
                }
            }),
            prisma.order.count()
        ])

        const totalPages = Math.ceil(totalOrders / limit)

        res.json({
            orders,
            pagination: {
                page,
                limit,
                totalOrders,
                totalPages
            }
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}