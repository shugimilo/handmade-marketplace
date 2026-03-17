import prisma from '../prismaClient.js'

export async function createReview(req, res) {
    const userId = Number(req.userId);
    const { rating, comment } = req.body;
    const itemId = Number(req.params.id);

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    try {
        const eligibleOrder = await prisma.order.findFirst({
            where: {
                buyerId: userId,
                status: {
                    in: ["Delivered"]
                },
                orderItems: {
                    some: {
                        itemId
                    }
                }
            },
            select: { id: true }
        });

        if (!eligibleOrder) {
            return res.status(403).json({
                message: "You can only review items you have purchased."
            });
        }

        const review = await prisma.review.create({
            data: {
                itemId,
                reviewerId: userId,
                rating,
                comment
            }
        });

        return res.json({ review });
    } catch (err) {
        if (err.code === "P2002") {
            return res.status(400).json({ message: "You already reviewed this item" });
        }

        return res.status(500).json({ message: err.message });
    }
}

export async function deleteReview(req, res) {
    const reviewId = Number(req.params.id)

    try {
        const deletedReview = await prisma.review.deleteMany({
            where: { id: reviewId }
        })

        if (deletedReview.count === 0) {
            return res.status(404).json({ message: "Review not found or not yours" })
        }

        res.json({ message: "Review deleted" })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

export async function getAllReviews(req, res) {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 12
    const skip = (page - 1) * limit

    try {
        const [reviews, totalReviews] = await Promise.all([
            prisma.review.findMany({
                select: {
                    id: true,
                    itemId: true,
                    reviewerId: true,
                    rating: true,
                    comment: true,
                    reviewedOn: true
                },
                skip,
                take: limit,
                orderBy: {
                    id: "desc"
                }
            }),
            prisma.review.count()
        ])

        const totalPages = Math.ceil(totalReviews / limit)

        res.json({
            reviews,
            pagination: {
                page,
                limit,
                totalReviews,
                totalPages
            }
        })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}