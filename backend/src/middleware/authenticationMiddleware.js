import jwt from 'jsonwebtoken'

export default function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(400).json({ message: "No token provided" })
    }
    
    // console.log(`Received authorization string: ${authHeader}`)
    let [ bearer, token ] = authHeader.split(' ') // This separates the token from 'Bearer'
    if (!token) token = bearer
    // console.log(`Received token: ${token}`)

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) { return res.status(400).json({ message: "Invalid token" }) }
        req.userId = decoded.id
        req.isAdmin = decoded.isAdmin
        next()
    })
}

export function lightAuthMiddleware(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        console.log("No token provided")
    }
    
    // console.log(`Received authorization string: ${authHeader}`)
    let [ bearer, token ] = authHeader.split(' ') // This separates the token from 'Bearer'
    if (!token) token = bearer
    // console.log(`Received token: ${token}`)

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) console.log("Invalid token")
        req.userId = decoded.id
        req.isAdmin = decoded.isAdmin
        next()
    })
}