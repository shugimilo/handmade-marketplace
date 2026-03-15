import prisma from "../prismaClient.js"
import { basicUserInfo, basicItemInfo } from "../../prisma/selects/basic.select.js"

export async function searchAll(req, res) {
    const q = req.query.q?.trim()

    if (q.length < 2) {
        return res.status(400).json({ message: "Search query must be at least 2 characters" })
    }

    const page = Number(req.query.page) || 1
    const limit = Math.min(Number(req.query.limit) || 5, 20)
    const skip = (page - 1) * limit

    if (!q) {
        return res.status(400).json({ message: "Search query is required" })
    }

    try {
        const [
            users,
            totalUsers,
            items,
            totalItems,
            categories,
            totalCategories
        ] = await Promise.all([
            prisma.user.findMany({
                where: {
                    OR: [
                        { username: { contains: q, mode: "insensitive" } },
                        { firstName: { contains: q, mode: "insensitive" } },
                        { lastName: { contains: q, mode: "insensitive" } }
                    ]
                },
                select: basicUserInfo,
                skip,
                take: limit
            }),
            prisma.user.count({
                where: {
                    OR: [
                        { username: { contains: q, mode: "insensitive" } },
                        { firstName: { contains: q, mode: "insensitive" } },
                        { lastName: { contains: q, mode: "insensitive" } }
                    ]
                }
            }),

            prisma.item.findMany({
                where: {
                    OR: [
                        { name: { contains: q, mode: "insensitive" } },
                        { description: { contains: q, mode: "insensitive" } }
                    ]
                },
                select: basicItemInfo,
                skip,
                take: limit
            }),
            prisma.item.count({
                where: {
                    OR: [
                        { name: { contains: q, mode: "insensitive" } },
                        { description: { contains: q, mode: "insensitive" } }
                    ]
                }
            }),

            prisma.category.findMany({
                where: {
                    name: { contains: q, mode: "insensitive" }
                },
                select: {
                    id: true,
                    name: true
                },
                skip,
                take: limit
            }),
            prisma.category.count({
                where: {
                    name: { contains: q, mode: "insensitive" }
                }
            })
        ])

        res.json({
            users,
            items,
            categories,
            pagination: {
                page,
                limit,
                totals: {
                    users: totalUsers,
                    items: totalItems,
                    categories: totalCategories
                },
                totalPages: {
                    users: Math.ceil(totalUsers / limit),
                    items: Math.ceil(totalItems / limit),
                    categories: Math.ceil(totalCategories / limit)
                }
            }
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}