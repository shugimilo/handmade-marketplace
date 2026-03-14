import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "src/public/uploads/items")
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)

        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
})

const allowedTypes = ["image/jpeg", "image/png", "image/webp"]

const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error("Only JPEG, PNG, and WEBP images are allowed"), false)
    }
}


const uploadItemImageMiddleware = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})

export default uploadItemImageMiddleware