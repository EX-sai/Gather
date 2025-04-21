import express from "express";
import {
	signup, login, logout, verifyToken, getAllUsers, deleteUser, updateUser, createUser
} from "../controllers/authController.js";
import { validateSignup, validateLogin } from "../validations/authValidation.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.post("/logout", logout);
router.get("/verify", verifyToken); // Add this new route

router.get('/admin/users', authMiddleware, adminMiddleware, getAllUsers);
router.delete('/admin/users/:email', authMiddleware, adminMiddleware, deleteUser);
router.post('/admin/users',authMiddleware,adminMiddleware,createUser);
router.put('/admin/users/:email', authMiddleware, adminMiddleware, updateUser);

export default router;
