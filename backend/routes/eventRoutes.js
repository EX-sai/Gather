import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  upload,
  registerForEvent,
  getEventsByOrganiser,
  getRegisteredEvents
} from "../controllers/eventController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import organiserMiddleware from "../middleware/organiserMiddleware.js";

const router = express.Router();

// Create event with file upload (organiser only)
router.post("/", authMiddleware, organiserMiddleware, upload.single("banner"), createEvent);

// Get all events
router.get("/", getAllEvents);

// Get single event
router.get("/:id", getEventById);

// Update event with optional file upload (organiser only)
router.put("/:id", authMiddleware, organiserMiddleware, upload.single("banner"), updateEvent);

// Delete event (organiser only)
router.delete("/:id", authMiddleware, organiserMiddleware, deleteEvent);

// Register for event (customer only)
router.post("/:eventId/register", authMiddleware, registerForEvent);

// Get events by organiser
router.get("/organiser/:organiserId", getEventsByOrganiser);

// Get registered events for current user
router.get("/user/registered", authMiddleware, getRegisteredEvents);

export default router;