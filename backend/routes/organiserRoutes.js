// backend/routes/organiserRoutes.js
import express from "express";
import { getOrganiserDashboard } from "../controllers/organiserController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import organiserMiddleware from "../middleware/organiserMiddleware.js";

const router = express.Router();

router.get(
	"/dashboard",
	authMiddleware,
	organiserMiddleware,
	getOrganiserDashboard
);

export default router;
