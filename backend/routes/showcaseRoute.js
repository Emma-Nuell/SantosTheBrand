// routes/showcaseRoutes.js
import express from "express";
import {
  createShowcaseSlide,
  getSlideshow,
  getAllSlides,
  getSlideById,
  updateShowcaseSlide,
  deleteShowcaseSlide,
  toggleSlideStatus,
  reorderSlides,
  getShowcaseStats,
} from "../controllers/showcaseController.js";
import { authenticateAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/slideshow", getSlideshow); // For the actual slideshow display
router.get("/", getAllSlides); // Get all slides (with filters)
router.get("/:id", getSlideById);

// Protected routes (require authentication)
router.use(authenticateAdmin);

// Admin routes
router.post("/admin/create", createShowcaseSlide);
router.put("/admin/:id", updateShowcaseSlide);
router.patch("/admin/:id/toggle", toggleSlideStatus);
router.post("/admin/reorder", reorderSlides);
router.get("/admin/stats/overview", getShowcaseStats);

// Superadmin routes
router.delete("/:id", deleteShowcaseSlide);

export default router;
