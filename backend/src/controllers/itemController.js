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
                authorId: req.userId,
                categories: {
                    connect: categories.map(id => ({ id }))
                }
            }
        })

        res.json({ item })
    } catch (err) {
        res.status(500).json({ message: `Server error: ${err.message}` })
    }
}

export async function getItems(req, res) {
    try {
        const items = await prisma.item.findMany()

        if (items.length === 0) return res.status(400).json({ message: "There are no items" })

        res.json({ items })
    } catch (err) {
        res.status(500).json({ message: `Server error: ${err.message}`} )
    }
}

export async function getItemById(req, res) {
    const id = Number(req.params.id)

    try {
        const item = await prisma.item.findUnique({
            where: { id }
        })

        if (!item) return res.status(400).json({ message: "No item found" })

        res.json({ item })
    } catch (err) {
        return res.status(500).json({ message: `Server error: ${err.message}` })
    }
}

export async function updateItem(req, res) {
    const id = Number(req.params.id)
    const { name, description, price, pickupAvailable, deliveryAvailable } = req.body

    if (!id) return res.status(400).json({ message: "Item not found" })

    try {
        const updatedItem = await prisma.item.update({
            where: { id },
            data: {
                name,
                description,
                price,
                pickupAvailable,
                deliveryAvailable
            }
        })

        res.json({ updatedItem })
    } catch (err) {
        res.status(500).json({ message: `Server error: ${err.message}` })
    }
}

export async function deleteItem(req, res) {
    const id = Number(req.params.id)

    try {
        const deletedItem = await prisma.item.delete({
            where: { id }
        })

        res.json({ deletedItem })
    } catch (err) {
        res.status(500).json({ message: `Server error: ${err.message}` })
    }
}