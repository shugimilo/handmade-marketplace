import express from "express"

import {
  getCurrentUser,
  getUserProfile,
  getBasicUserInfo,
  searchUsers,
  getAllUsers,
  updateProfile,
  deleteUser,
  adminDeleteUser
} from "../controllers/userController.js"

import { getItemsByUserId } from "../controllers/itemController.js"

import {
  authorizeAdmin,
  authorizeSelf
} from "../middleware/authorizationMiddleware.js"

import { uploadProfilePicture } from "../controllers/userController.js"
import uploadProfilePictureMiddleware from "../middleware/uploadProfilePictureMiddleware.js"

import authenticationMiddleware from "../middleware/authenticationMiddleware.js"

const router = express.Router()

router.get("/search", searchUsers)

router.post(
  "/me/profile-picture",
  authenticationMiddleware,
  uploadProfilePictureMiddleware.single("image"),
  uploadProfilePicture
)
router.get("/me", authenticationMiddleware, getCurrentUser)
router.put("/me", authenticationMiddleware, updateProfile)
router.delete("/me", authenticationMiddleware, deleteUser)

router.get("/:id/items", getItemsByUserId)
router.get("/:id/basic", getBasicUserInfo)
router.get("/:id", getUserProfile)

router.get("/", authenticationMiddleware, authorizeAdmin, getAllUsers)
router.delete("/:id", authenticationMiddleware, authorizeAdmin, adminDeleteUser)

export default router