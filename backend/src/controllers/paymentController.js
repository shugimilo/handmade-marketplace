import prisma from "../prismaClient.js";

export async function createPayment(req, res) {
    const userId = Number(req.userId)
    const orderId = Number(req.body.orderId)
    const { status } = req.body

    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            select: { buyerId: true }
        })

        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }

        if (order.buyerId !== userId) {
            return res.status(403).json({ message: "Action unauthorized" })
        }

        const payment = await prisma.payment.upsert({
            where: { id: orderId },
            update: {
                status
            },
            create: {
                orderId,
                status
            }
        })
        
        res.json({ payment })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}