import prisma from "../prismaClient.js";

export async function createPayment(req, res) {
    const { orderId, status } = req.body

    try {
        const payment = await prisma.payment.create({
            data: {
                orderId,
                status
            }
        })
        
        res.json({ payment })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}