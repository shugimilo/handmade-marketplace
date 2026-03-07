import express from 'express';
import prisma from '../prismaClient.js';

const router = express.Router()

router.get('/users', async (req, res) => {
    const users = await prisma.user.findMany()

    res.json({ users })
})

router.get('/users/:id', async (req, res) => {
    const { id } = req.params
    const user = await prisma.user.findUnique({
        where: {id: parseInt(id)}
    })

    res.json({ user })
})

export default router