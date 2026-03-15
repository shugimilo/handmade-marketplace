import multer from "multer"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/public/uploads/profiles")
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop()
    cb(null, `user-${req.userId}-${Date.now()}.${ext}`)
  }
})

const uploadProfilePicture = multer({ storage })

export default uploadProfilePicture