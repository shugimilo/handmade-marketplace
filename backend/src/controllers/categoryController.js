import prisma from "../prismaClient.js"
import { basicItemInfo } from "../../prisma/selects/basic.select.js"

export async function getAllCategories(req, res) {
    try {
        const categories = await prisma.category.findMany({
            select: {
                id: true,
                name: true
            }
        })

        res.json({ categories })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export async function getCategoryItems(req, res) {
    const id = Number(req.params.id)

    try {
        const category = await prisma.category.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                items: {
                    select: basicItemInfo
                }
            }
        })

        if (!category) {
            return res.status(404).json({ message: "Category not found" })
        }

        res.json({ category })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}