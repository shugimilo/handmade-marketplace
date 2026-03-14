import { basicUserInfo } from '../../prisma/selects/basic.select.js'
import { currentUser, publicUserProfile } from '../../prisma/selects/user.select.js'
import prisma from '../prismaClient.js'

// For simple profile displays, e.g. above reviews & item containers etc.

export async function getBasicUserInfo(req, res) {
    const id = Number(req.params.id)

    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: basicUserInfo
        })

        res.json({ user })
    } catch (err) {
        return res.status(500).json({ message: `Server error: ${err.message}` })
    }
}

// For dynamic user search

export async function searchUsers(req, res) {
    const query = req.query.q

    if (!query) return res.status(400).json({ message: "Search query required" })

    try {
        const users = await prisma.user.findMany({
            where: {
                username: {
                    contains: query,
                    mode: "insensitive"
                }
            },
            select: basicUserInfo,
            take: 10
        })

        res.json({ users })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// For other users' profiles

export async function getUserProfile(req, res) {
    const id = Number(req.params.id)

    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: publicUserProfile
        })

        if (!user) return res.status(404).json({ message: "User not found" })

        res.json({ user })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

// For fetching the full profile of the user logged in

export async function getCurrentUser(req, res) {
    const id = Number(req.userId) // This marks the logged-in user

    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: currentUser
        })

        res.json({ user })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

// For the admin panel

export async function getAllUsers(req, res) {
    try {
        const users = await prisma.user.findMany({
            select: basicUserInfo
        })

        res.json({ users })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

// For when users update their own profile

export async function updateProfile(req, res) {
    const id = Number(req.userId)
    const { username, email, pfpUrl, bio } = req.body

    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                email,
                username,
                pfpUrl,
                bio
            }
        })

        res.json({ updatedUser })
    } catch (err) {
        if (err.code === 'P2002') {
            return res.status(409).json({ message: 'Username or email already taken' })
        }

        res.status(500).json({ message: `Server error: ${err.message}` })
    }
}

// For when users delete their own profile

export async function deleteUser(req, res) {
    const id = Number(req.userId)
    try {
        const deletedUser = await prisma.user.delete({
            where: { id }
        })

        res.json({ deletedUser })
    } catch (err) {
        res.status(500).json({ message: `Server error: ${err.message}`})
    }
}

// For user deletion triggered by admins

export async function adminDeleteUser(req, res) {
        const id = Number(req.params.id)
    try {
        const deletedUser = await prisma.user.delete({
            where: { id }
        })

        res.json({ deletedUser })
    } catch (err) {
        res.status(500).json({ message: `Server error: ${err.message}`})
    }
}