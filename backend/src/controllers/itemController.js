import { basicItemInfo } from '../../prisma/selects/basic.select.js'
import { itemOwnerView, publicItemView } from '../../prisma/selects/item.select.js'
import prisma from '../prismaClient.js'

export async function createItem(req, res) {
    const { name, description, price, pickupAvailable, deliveryAvailable, categories } = req.body

    try {
        const item = await prisma.item.create({
            data: {
                name,
                description,
                price,
                pickupAvailable,
                deliveryAvailable,
                authorId: Number(req.userId),
                categories: {
                    connect: categories.map(id => ({ id }))
                }
            }
        })

        res.json({ item })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export async function getAllItems(req, res) {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 12
    const skip = (page - 1) * limit

    try {
        const [items, totalItems] = await Promise.all([
            prisma.item.findMany({
                select: basicItemInfo,
                skip,
                take: limit
            }),
            prisma.item.count()
        ])

        const totalPages = Math.ceil(totalItems / limit)

        res.json({
            items,
            pagination: {
                page,
                limit,
                totalItems,
                totalPages
            }
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export async function getItemById(req, res) {
    const id = Number(req.params.id)
    // const userId = req.userId ? Number(req.userId) : null

    try {
        const existingItem = await prisma.item.findUnique({
            where: { id },
            select: { authorId: true }
        })

        if (!existingItem) {
            return res.status(404).json({ message: "No item found" })
        }

        const item = await prisma.item.findUnique({
            where: { id },
            // select: Number(existingItem.authorId) === userId ? itemOwnerView : publicItemView
            select: publicItemView
        })

        res.json({ item })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

export async function getItemsByUserId(req, res) {
    const authorId = Number(req.params.id)

    try {
        const userItems = await prisma.item.findMany({
            where: { authorId },
            select: basicItemInfo
        })

        if (userItems.length === 0) return res.status(404).json({ message: "User has no items" })

        res.json({ userItems })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export async function updateItem(req, res) {
    const id = Number(req.params.id)
    const { name, description, price, currency, pickupAvailable, deliveryAvailable, categories } = req.body

    if (!id) return res.status(400).json({ message: "Item not found" })

    try {
        const updatedItem = await prisma.item.update({
            where: { id },
            data: {
                name,
                description,
                price,
                currency,
                pickupAvailable,
                deliveryAvailable,
                categories: {
                    set: categories.map(id => ({ id }))
                }
            }
        })

        res.json({ updatedItem })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export async function deleteItem(req, res) {
    const id = Number(req.params.id);

    console.log(`Received item id: ${id}`);

    try {
        const existingOrderItem = await prisma.orderItem.findFirst({
            where: { itemId: id },
            select: { id: true }
        });

        if (existingOrderItem) {
            return res.status(400).json({
                message: "This item cannot be deleted because it appears in existing orders."
            });
        }

        const deletedItem = await prisma.$transaction(async (tx) => {
            await tx.itemImage.deleteMany({
                where: { itemId: id }
            });

            await tx.favorite.deleteMany({
                where: { itemId: id }
            });

            await tx.review.deleteMany({
                where: { itemId: id }
            });

            await tx.cartItem.deleteMany({
                where: { itemId: id }
            });

            return await tx.item.delete({
                where: { id }
            });
        });

        console.log(`Deleted item with id ${deletedItem.id}`);

        return res.json({ deletedItem });
    } catch (err) {
        console.error("Delete item error:", err);
        return res.status(500).json({ message: err.message });
    }
}