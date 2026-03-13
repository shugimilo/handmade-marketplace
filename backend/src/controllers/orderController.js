import prisma from '../prismaClient.js'

export async function createOrder(req, res) {
    const { buyerId, sellerId, total } = req.body

    try {
        const order = await prisma.order.create({
            data: {
                buyerId,
                sellerId,
                total
            }
        })

        res.json({ order })
    } catch (err) {
        return res.status(500).json({ message: `Server error: ${err.message}` })
    }
}

export async function getOrders(req, res) {
    try {
        const orders = await prisma.order.findMany()

        if (orders.length === 0) return res.status(404).json({ message: "No orders found" })

        res.json({ orders })
    } catch (err) {
        return res.status(500).json({ message: `Server error: ${err.message}` })
    }
}

export async function getOrderById(req, res) {
    const orderId = Number(req.params.id)

    if (!orderId) return res.status(400).json({ message: "Order id not provided" })

    try {
        const order = await prisma.order.findUnique({
            where: { orderId }
        })

        if (!order) return res.status(404).json({ message: "Order with provided id not found" })
    } catch (err) {
        return res.status(500).json({ message: `Server error: ${err.message}` })        
    }
}