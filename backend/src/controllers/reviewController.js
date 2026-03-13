import prisma from '../prismaClient.js'

export async function getReviews(req, res) {
    try {
        const reviews = await prisma.review.findMany()

        if (reviews.length === 0) return res.status(404).json({ message: "No reviews found" })

        res.json({ reviews })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

export async function getReviewById(req, res) {
    const reviewId = Number(req.params.id)

    if (!reviewId) return res.status(400).json({ message: "Review id not provided" })

    try {
        const review = await prisma.review.findUnique({
            where: { reviewId }
        })

        if (!review) return res.status(404).json({ message: "Review with provided id not found" })
    } catch (err) {
        return res.status(500).json({ message: err.message })        
    }
}

export async function createReview(req, res) {
    const { itemId, reviewerId, rating, comment } = req.body

    try {
        const review = await prisma.review.create({
            data: {
                itemId,
                reviewerId,
                rating,
                comment
            }
        })

        res.json({ review })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

export async function deleteReview(req, res) {
    const reviewId = Number(req.params.id)

    try {
        const deletedReview = await prisma.review.delete({
            where: { id: reviewId }
        })

        res.json({ deletedReview })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}