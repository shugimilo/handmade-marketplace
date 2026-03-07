import express from 'express';
import '../config.js';
import authRoutes from './routes/authRoutes.js';
import apiRoutes from './routes/apiRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';

const PORT = process.env.SERVER_PORT || 3000;

const app = express()

// ----------- MIDDLEWARE -----------

app.use(express.json())

// ----------- ROUTES -----------

app.use('/auth', authRoutes)
app.use('/api', authMiddleware, apiRoutes)

// ----------- FINAL FUNCTION CALL -----------

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})