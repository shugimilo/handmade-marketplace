import express from 'express'
import '../config.js'

const PORT = process.env.SERVER_PORT || 3000;

const app = express()

// ----------- MIDDLEWARE -----------

app.use(express.json())

// ----------- ROUTES -----------



// ----------- FINAL FUNCTION CALL -----------

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})