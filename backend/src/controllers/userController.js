import prisma from '../prismaClient.js'

export async function getUsers(req, res) {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true,
                firstName: true,
                lastName: true,
                pfpUrl: true,
                isAdmin: true
            }
        })

        if (users.length === 0) return res.status(400).json({ message: 'There are no users' })

        res.json({ users })
    } catch (err) {
        res.status(500).json({ message: `Server error: ${err.message}`})
    }
}

export async function getUserById(req, res) {
    const id = Number(req.params.id)

    if (!id) return res.status(400).json({ message: "No id provided" })
    
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true,
                firstName: true,
                lastName: true,
                pfpUrl: true,
                isAdmin: true
            }
        })

        if (!user) return res.status(400).json({ message: "User not found" })

        res.json({ user })
        } catch (err) {
            res.status(500).json({message: `Server error: ${err.message}`})
        }
}

export async function updateUser(req, res) {
    const id = Number(req.userId)
    const { username, email } = req.body

    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                email: email,
                username: username,
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

export async function deleteUser(req, res) {
    const id = Number(req.userId)
    try {
        const deletedUser = await prisma.user.delete({
            where: { id }
        })

        if (!deletedUser) return res.status(400).json({ message: "User doesn't exist" })

        res.json({ deletedUser })
    } catch (err) {
        res.status(500).json({ message: `Server error: ${err.message}`})
    }
}