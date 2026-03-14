import prisma from '../prismaClient.js'

export async function createReview(req, res) {
    const userId = Number(req.userId)
    const { itemId, rating, comment } = req.body

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" })
    }

    try {
        const review = await prisma.review.create({
            data: {
                itemId,
                reviewerId: userId,
                rating,
                comment
            }
        })

        res.json({ review })
    } catch (err) {
        if (err.code === 'P2002') {
            return res.status(400).json({ message: "You already reviewed this item" })
        }

        return res.status(500).json({ message: err.message })
    }
}

export async function deleteReview(req, res) {
    const userId = Number(req.userId)
    const reviewId = Number(req.params.id)

    try {
        const deletedReview = await prisma.review.deleteMany({
            where: {
                reviewerId: userId,
                id: reviewId
            }
        })

        if (deletedReview.count === 0) {
            return res.status(404).json({ message: "Review not found or not yours" })
        }

        res.json({ message: "Review deleted" })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}