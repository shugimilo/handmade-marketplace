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
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 12
    const skip = (page - 1) * limit

    try {
        const category = await prisma.category.findUnique({
            where: { id },
            select: {
                id: true,
                name: true
            }
        })

        if (!category) {
            return res.status(404).json({ message: "Category not found" })
        }

        const [items, totalItems] = await Promise.all([
            prisma.item.findMany({
                where: {
                    categories: {
                        some: { id }
                    }
                },
                select: basicItemInfo,
                skip,
                take: limit
            }),
            prisma.item.count({
                where: {
                    categories: {
                        some: { id }
                    }
                }
            })
        ])

        res.json({
            category,
            items,
            pagination: {
                page,
                limit,
                totalItems,
                totalPages: Math.ceil(totalItems / limit)
            }
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export async function createCategory(req, res) {
    const { name } = req.body

    try {
        const category = await prisma.category.create({
            data: { name }
        })

        res.json({ category })
    } catch (err) {
        if (err.code === "P2002") {
            return res.status(400).json({ message: "Category already exists" })
        }

        res.status(500).json({ message: err.message })
    }
}

export async function deleteCategory(req, res) {
    const id = Number(req.params.id)

    try {
        const deletedCategory = await prisma.category.delete({
            where: { id }
        })

        res.json({ deletedCategory })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}