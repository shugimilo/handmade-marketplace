import { basicCartInfo } from "../../prisma/selects/basic.select.js";
import prisma from "../prismaClient.js";

export async function getUserCart(req, res) {
    const userId = Number(req.userId)

    try {
        const cart = await prisma.cart.findFirst({
            where: { userId },
            select: basicCartInfo
        })

        if (!cart) return res.status(400).json({ cart: null, total: 0 })

        const total = cart.cartItems.reduce(
            (sum, ci) => sum + ci.item.price * ci.quantity, 0
        )

        res.json({ cart, total })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export async function addItemToCart(req, res) {
    const userId = Number(req.userId)
    const { id, quantity } = req.body

    try {
        const cart = await prisma.cart.upsert({
            where: { userId },
            update: {},
            create: { userId }
        })

        const cartItem = await prisma.cartItem.upsert({
            where: { 
                cartId_itemId: {
                    cartId: cart.id,
                    itemId: id,
                }
            },
            update: {
                quantity: { increment: quantity || 1 }
            },
            create: {
                cartId: cart.id,
                itemId: id,
                quantity: quantity || 1
            }
        })

        res.json({ cartItem })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export async function deleteItemFromCart(req, res) {
    const id = Number(req.params.id)
    const userId = Number(req.userId)

    try {
        const itemToDelete = await prisma.cartItem.findFirst({
            where: { id },
            select: {
                cart: {
                    select: {
                        userId: true
                    }
                }
            }
        })

        if (!itemToDelete) return res.status(404).json({ message: "Item not found" })

        if (itemToDelete.cart.userId !== userId) return res.status(403).json({ message: "Action unauthorized" })

        const deletedCartItem = await prisma.cartItem.delete({
            where: { id }
        })

        res.json({ deletedCartItem })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

export async function decreaseCartItemQuantity(req, res) {
    const id = Number(req.params.id)
    const userId = Number(req.userId)
    let updatedCartItem;

    try {
        const itemToUpdate = await prisma.cartItem.findFirst({
            where: { id },
            select: {
                cart: {
                    select: {
                        userId: true
                    }
                }
            }
        })

        if (!itemToUpdate) return res.status(404).json({ message: "Item not found" })

        if (itemToUpdate.cart.userId !== userId) return res.status(403).json({ message: "Action unauthorized" })
        
        const cartItem = await prisma.cartItem.findUnique({
            where: { id }
        })
        
        if (cartItem.quantity <= 1) {
            updatedCartItem = await prisma.cartItem.delete({
                where: { id }
            })
        } else {
            updatedCartItem = await prisma.cartItem.update({
                where: { id },
                data: {
                    quantity: { decrement: 1 }
                }
            })
        }

        res.json({ updatedCartItem })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

export async function emptyCart(req, res) {
    const userId = Number(req.userId)

    try {
        const cart = await prisma.cart.findFirst({
            where: { userId },
            select: { id: true }
        })

        if (!cart) {
            return res.json({ message: "Cart already empty" })
        }

        const result = await prisma.cartItem.deleteMany({
            where: { cartId: cart.id }
        })

        res.json({ message: "Cart emptied", deletedItemCount: result.count })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}