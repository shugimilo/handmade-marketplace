import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import prisma from '../prismaClient.js'

export async function register(req, res) {
    const { username, password, email } = req.body

    try {
        const existingEmail = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        const existingUsername = await prisma.user.findUnique({
            where: {
                username: username
            }
        })

        if (existingEmail) {
            return res.status(400).json({ error: "Email already registered" })
        }
        if (existingUsername) {
            return res.status(400).json({ error: "Username already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 8)
        
        const user = await prisma.user.create({
            data: {
                username: username,
                password: hashedPassword,
                email: email
            }
        })

        const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ 
            token,
            "user": {
                "id": user.id,
                "username": user.username
            }
        })
    } catch(err) {
        console.error(`An error has occurred: ${err.message}`)
        res.sendStatus(503)
    }
}

export async function login(req, res) {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (!user) {
            return res.status(400).json({ error: "Email not registered" })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid password" })
        }

        const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({
            token,
            "user": {
                "id": user.id,
                "username": user.username
            }
        })
    } catch(err) {
        console.log({ message: `An error has occurred: ${err.message}` })
        res.sendStatus(503)
    }
}