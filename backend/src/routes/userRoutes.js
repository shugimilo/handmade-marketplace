import express from 'express';
import { deleteUser, getUserById, getUsers, updateUser } from '../controllers/userController.js';
import { authorizeSelfOrAdmin } from '../middleware/authorizationMiddleware.js';

const router = express.Router()

router.get('/', getUsers)
router.get('/:id', getUserById)
router.delete('/:id', authorizeSelfOrAdmin, deleteUser)
router.put('/:id', authorizeSelfOrAdmin, updateUser)

export default router