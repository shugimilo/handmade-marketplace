import express from 'express'
import '../config.js'
import apiRoutes from './routes/apiRoutes.js'

const PORT = process.env.SERVER_PORT || 3000

const app = express()

// ----------- MIDDLEWARE -----------

app.use(express.json())
app.use('/uploads', express.static('src/public/uploads'))

// ----------- ROUTES -----------

app.use('/api', apiRoutes)

// ----------- FINAL FUNCTION CALL -----------

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})