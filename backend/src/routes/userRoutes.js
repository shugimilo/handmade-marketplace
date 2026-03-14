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

import authMiddleware from "../middleware/authenticationMiddleware.js"

const router = express.Router()

router.get("/search", searchUsers)

router.get("/me", authMiddleware, getCurrentUser)
router.put("/me", authMiddleware, updateProfile)
router.delete("/me", authMiddleware, deleteUser)

router.get("/:id/items", getItemsByUserId)
router.get("/:id/basic", getBasicUserInfo)
router.get("/:id", getUserProfile)

router.get("/", authMiddleware, authorizeAdmin, getAllUsers)
router.delete("/:id", authMiddleware, authorizeAdmin, adminDeleteUser)

export default router