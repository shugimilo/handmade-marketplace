export function authorizeSelfOrAdmin(req, res, next) {
    const id = Number(req.params.id)
    const { userId, isAdmin } = req

    // console.log(`id: ${id}\tuserId: ${userId}\tisAdmin: ${isAdmin}`)

    if ((id !== userId) && !isAdmin) {
        // console.log(`${id} !== ${userId}`)
        return res.status(403).json({ message: "Action unauthorized" })
    }

    next()
}