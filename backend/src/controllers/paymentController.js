import Stripe from "stripe"
import prisma from "../prismaClient.js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function createPayment(req, res) {
    const userId = Number(req.userId)
    const orderId = Number(req.body.orderId)

    try {

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                orderItems: true
            }
        })

        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }

        if (order.buyerId !== userId) {
            return res.status(403).json({ message: "Action unauthorized" })
        }

        if (order.status !== "Created") {
           return res.status(400).json({ message: "Order already paid or processed" })
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: order.orderItems.map(item => ({
                price_data: {
                    currency: "rsd",
                    product_data: {
                        name: `Item ${item.itemId}`
                    },
                    unit_amount: Math.round(item.priceAtPurchase * 100)
                },
                quantity: item.quantity
            })),
            success_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel"
        })

        res.json({
            checkoutUrl: session.url
        })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}