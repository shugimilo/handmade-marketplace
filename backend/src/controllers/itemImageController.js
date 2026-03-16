import prisma from "../prismaClient.js";
import fs from "fs"
import path from "path"

export async function uploadItemImage(req, res) {
    const userId = Number(req.userId)
    const itemId = Number(req.params.itemId)

    try {
        const item = await prisma.item.findUnique({
            where: { id: itemId }
        })

        if (!item) {
            return res.status(404).json({ message: "Item not found" })
        }

        if (item.authorId !== userId) {
            return res.status(403).json({ message: "You don't own this item" })
        }
        
        const existingImageCount = await prisma.itemImage.count({
            where: {
                itemId
            }
        })

        if (existingImageCount >= 5) {
            return res.status(400).json({ message: "Maximum of 5 images per item allowed" })
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" })
        }

        const image = await prisma.itemImage.create({
            data: {
                url: `/uploads/items/${req.file.filename}`,
                itemId
            }
        })

        res.json({ image })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export async function deleteItemImage(req, res) {
    const userId = Number(req.userId)
    const itemId = Number(req.params.itemId)
    const imageId = Number(req.params.id)

    try {
        const image = await prisma.itemImage.findUnique({
            where: { id: imageId },
            include: {
                item: true
            }
        })

        if (!image) {
            return res.status(404).json({ message: "Image not found" })
        }

        if (image.itemId !== itemId) {
            return res.status(400).json({ message: "Image does not belong to this item" })
        }

        if (image.item.authorId !== userId) {
            return res.status(403).json({ message: "Not your item" })
        }

        const filePath = path.join("src/public", image.url)

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }

        await prisma.itemImage.delete({
            where: { id: imageId }
        })

        res.json({ message: "Image deleted" })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}