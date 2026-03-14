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
        const shippingAddress = await prisma.shippingAddress.findUnique({
            where: { 
                id,
                userId
            },
            select: fullShippingAddressInfo
        })

        res.json({ shippingAddress })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export async function updateShippingAddress(req, res) {
    const { id, houseNo, neighborhood, city } = req.body

    try {
        const updatedShippingAddress = await prisma.shippingAddress.update({
            where: { id: parseInt(id) },
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
    const { id } = Number(req.body)

    try {
        const deletedShippingAddress = await prisma.shippingAddress.delete({
            where: { id }
        })

        res.json({ deletedShippingAddress })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}