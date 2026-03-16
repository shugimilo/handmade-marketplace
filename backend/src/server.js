import express from 'express'
import cors from 'cors'
import '../config.js'
import apiRoutes from './routes/apiRoutes.js'
import { stripeWebhook } from './controllers/paymentController.js'

const PORT = process.env.SERVER_PORT || 3000

const app = express()

// ----------- MIDDLEWARE -----------

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"]
}))

app.post(
    "/api/payments/webhook",
    express.raw({ type: "application/json" }),
    stripeWebhook
);

app.use(express.json())
app.use('/uploads', express.static('src/public/uploads'))

// ----------- ROUTES -----------

app.use('/api', apiRoutes)

// ----------- FINAL FUNCTION CALL -----------

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})