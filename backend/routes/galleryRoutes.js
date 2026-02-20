import express from "express";
const router = express.Router();
import { getGallery, getGalleryImage, createGalleryImage, updateGalleryImage, deleteGalleryImage, reorderGallery, getAllGalleryImages, uploadGalleryImage } from "../controllers/galleryController";
import { authenticateAdmin } from "../middlewares/authMiddleware.js";

// Public routes
router.get("/", getGallery);
router.get("/:id", getGalleryImage);

// Admin routes
router.use("/admin", authenticateAdmin);
router.get("/admin/all", getAllGalleryImages);
router.post("/admin", createGalleryImage);
router.post("/admin/upload", uploadGalleryImage);
router.put("/admin/reorder", reorderGallery);
router.put("/admin/:id", updateGalleryImage);
router.delete("/admin/:id", deleteGalleryImage);

export default router;
