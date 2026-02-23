import express from "express";
const router = express.Router();
import { authenticateAdmin } from "../middlewares/authMiddleware.js";
import { createEvent, getEvents, getUpcomingEvents, getPastEvents, getEventById, updateEvent, deleteEvent, updateEventPriority } from "../controllers/eventController.js";

// Public routes
router.get("/", getEvents);
router.get("/upcoming", getUpcomingEvents);
router.get("/past", getPastEvents);
router.get("/:id", getEventById);

// Admin routes
router.use("/admin", authenticateAdmin);
router.post("/admin/create", createEvent);
router.put("/admin/:id", updateEvent);
router.put("/admin/:id/priority", updateEventPriority);
router.delete("/admin/:id", deleteEvent);

export default router;