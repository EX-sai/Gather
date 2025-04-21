// backend/routes/customerRoutes.js
import express from "express";
import { getCustomerDashboard } from "../controllers/customerController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/customer/dashboard
router.get("/dashboard", authMiddleware, getCustomerDashboard);

export default router;
