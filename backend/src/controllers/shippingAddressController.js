import prisma from "../prismaClient.js";
import { basicShippingAddressInfo } from "../../prisma/selects/basic.select.js";
import { fullShippingAddressInfo } from "../../prisma/selects/shippingAddress.select.js";

// req.UserId ---> users can only add new addresses to their profile, not others'
export async function createShippingAddress(req, res) {
    const userId = Number(req.userId)
    const { street, houseNo, neighborhood, city } = req.body

    try {
        const shippingAddress = await prisma.shippingAddress.create({
            data: {
                userId,
                street,
                houseNo,
                neighborhood,
                city
            }
        })

        res.json({ shippingAddress })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export async function getUserShippingAddresses(req, res) {
    const userId = Number(req.userId)

    try {
        const shippingAddresses = await prisma.shippingAddress.findMany({
            where: { userId },
            select: basicShippingAddressInfo
        })

        res.json({ shippingAddresses })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export async function getShippingAddressFull(req, res) {
    const userId = Number(req.userId)
    const id = Number(req.params.id)

    try {
        const shippingAddress = await prisma.shippingAddress.findFirst({
            where: { 
                id,
                userId
            },
            select: fullShippingAddressInfo
        })

        if (!shippingAddress) {
            return res.status(404).json({ message: "Shipping address not found" })
        }

        res.json({ shippingAddress })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export async function updateShippingAddress(req, res) {
    const userId = Number(req.userId)
    const id = Number(req.params.id)
    const { street, houseNo, neighborhood, city } = req.body

    try {
        const existingAddress = await prisma.shippingAddress.findFirst({
            where: {
                id,
                userId
            },
            select: { id: true }
        })

        if (!existingAddress) {
            return res.status(404).json({ message: "Shipping address not found or not yours" })
        }

        const updatedShippingAddress = await prisma.shippingAddress.update({
            where: { id },
            data: {
                street,
                houseNo,
                neighborhood,
                city
            }
        })

        res.json({ updatedShippingAddress })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export async function deleteShippingAddress(req, res) {
    const userId = Number(req.userId)
    const id = Number(req.params.id)

    try {
        const deletedShippingAddress = await prisma.shippingAddress.deleteMany({
            where: {
                id,
                userId
            }
        })

        if (deletedShippingAddress.count === 0) {
            return res.status(404).json({ message: "Shipping address not found or not yours" })
        }

        res.json({ message: "Shipping address deleted" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}