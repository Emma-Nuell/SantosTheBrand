import express from "express";
const router = express.Router();
import { createProduct, deleteProduct, getAllCategories, getAllProducts, getProductById, getProductsByCategory, updateProduct, activateProduct, bulkUpdateProducts, getProductStatistics, getFeaturedAndTrending, setProductFeatured, setProductTrending } from "../controllers/productController.js";
import { authorizeRoles, authenticateAdmin } from "../middlewares/authMiddleware.js";
import {validateCreateProduct, validateUpdateProduct, validateGetProducts} from "../validators/productValidators.js";


// Public routes
router.get("/", validateGetProducts, getAllProducts);
router.get('/featured-and-trending', getFeaturedAndTrending);
router.get('/categories/all', getAllCategories);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);

// Admin protected routes
router.use(authenticateAdmin);

// Admin-only product management
router.post("/admin/create", authenticateAdmin, validateCreateProduct, createProduct);
router.put("/admin/:id", authenticateAdmin, validateUpdateProduct, updateProduct);
router.delete('/admin/:id', deleteProduct);
router.put('/admin/:id/activate', activateProduct);
router.put('/admin/:id/feature', setProductFeatured);
router.put('/admin/:id/trend', setProductTrending);

// Bulk operations
router.put('/admin/bulk/update', bulkUpdateProducts);

// Statistics (admin only)
router.get('/admin/statistics/overview', getProductStatistics);

export default router

