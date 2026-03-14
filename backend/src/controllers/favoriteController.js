import prisma from "../prismaClient.js";

export async function markItemAsFavorite(req, res) {
    const userId = Number(req.userId)
    const id = Number(req.params.id)

    try {
        const favorite = await prisma.favorite.upsert({
            where: {
                userId_itemId: {
                    userId,
                    itemId: id
                }
            },
            update: {},
            create: {
                userId,
                itemId: id
            }
        })

        res.json({ favorite })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

export async function unmarkItemAsFavorite(req, res) {
    const userId = Number(req.userId)
    const id = Number(req.params.id)

    try {
        const deletedFavorite = await prisma.favorite.delete({
            where: {
                userId_itemId: {
                    userId,
                    itemId: id
                }
            }
        })

        res.json({ deletedFavorite })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}