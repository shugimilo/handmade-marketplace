import prisma from "../prismaClient.js"

export function authorizeSelf(req, res, next) {
    const id = Number(req.body.id)
    const { userId } = req

    if (id !== userId) {
        return res.status(403).json({ message: "Action unauthorized" })
    }

    next()
}

export function authorizeAdmin(req, res, next) {
    const { isAdmin } = req

    if (!isAdmin) {
        return res.status(403).json({ message: "Action unauthorized" })
    }

    next()
}

export async function authorizeItemOwnerOrAdmin(req, res, next) {
    const userId = Number(req.userId)
    const isAdmin = req.isAdmin
    const id = Number(req.params.id)

    console.log("Item id: ", id)

    try {
        const item = await prisma.item.findUnique({
            where: { id },
            select: { authorId: true }
        })

        console.log(`Author of item with id ${id} is user with id ${item.authorId}`)

        if (!item) return res.status(404).json({ message: "Item not found" })

        if (userId !== item.authorId && !isAdmin) return res.status(403).json({ message: "Action unauthorized" })

        next()
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}