// backend/routes/adminRoutes.js
import express from "express";
import { getAdminDashboard } from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// GET /api/admin/dashboard
router.get(
	"/dashboard",
	authMiddleware,
	adminMiddleware,
	getAdminDashboard
);

export default router;
