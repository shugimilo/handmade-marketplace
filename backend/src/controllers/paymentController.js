import Stripe from "stripe";
import prisma from "../prismaClient.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function stripeWebhook(req, res) {
    console.log("Stripe webhook hit");

    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
        console.log("Webhook verified:", event.type);
    } catch (err) {
        console.error("Webhook signature error:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            console.log("Checkout session completed:", session.id);
            console.log("Metadata:", session.metadata);

            const orderIds = session.metadata?.orderIds
                ? JSON.parse(session.metadata.orderIds)
                : [];

            const buyerId = Number(session.metadata?.buyerId);

            console.log("Parsed orderIds:", orderIds, "buyerId:", buyerId);

            if (orderIds.length > 0) {
                await prisma.$transaction(async (tx) => {
                    const updated = await tx.order.updateMany({
                        where: {
                            id: { in: orderIds },
                            buyerId
                        },
                        data: {
                            status: "Paid"
                        }
                    });

                    console.log("Orders updated:", updated);

                    for (const orderId of orderIds) {
                        await tx.payment.upsert({
                            where: { orderId },
                            update: {
                                status: "Paid",
                                stripeSessionId: session.id
                            },
                            create: {
                                orderId,
                                status: "Paid",
                                stripeSessionId: session.id
                            }
                        });
                    }
                });
            }
        }

        return res.json({ received: true });
    } catch (err) {
        console.error("Webhook processing error:", err.message);
        return res.status(500).json({ message: err.message });
    }
}
export async function createPayment(req, res) {
    const userId = Number(req.userId);
    const orderIds = Array.isArray(req.body.orderIds)
        ? req.body.orderIds.map(Number)
        : [];

    if (orderIds.length === 0) {
        return res.status(400).json({ message: "No order IDs provided" });
    }

    try {
        const orders = await prisma.order.findMany({
            where: {
                id: { in: orderIds },
                buyerId: userId
            },
            include: {
                orderItems: {
                    include: {
                        item: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });

        if (orders.length !== orderIds.length) {
            return res.status(404).json({ message: "One or more orders not found" });
        }

        const invalidOrder = orders.find(order => order.status !== "Created");

        if (invalidOrder) {
            return res.status(400).json({
                message: `Order ${invalidOrder.id} is already paid or processed`
            });
        }

        const lineItems = orders.flatMap(order =>
            order.orderItems.map(orderItem => ({
                price_data: {
                    currency: (orderItem.currencyAtPurchase || "rsd").toLowerCase(),
                    product_data: {
                        name: orderItem.item?.name || `Item ${orderItem.itemId}`
                    },
                    unit_amount: Math.round(orderItem.priceAtPurchase * 100)
                },
                quantity: orderItem.quantity
            }))
        );

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: lineItems,
            success_url: "http://localhost:5173/orders?payment=success",
            cancel_url: "http://localhost:5173/orders?payment=cancelled",
            metadata: {
                buyerId: String(userId),
                orderIds: JSON.stringify(orderIds)
            }
        });

        res.json({
            checkoutUrl: session.url
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}