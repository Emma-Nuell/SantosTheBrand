import Gallery from "../models/galleryModel.js";

// @desc    Get all gallery images (public)
// @route   GET /api/gallery
// @access  Public
export const getGallery = async (req, res) => {
  try {
    const { category, tag } = req.query;

    const filter = { isActive: true };

    if (category) {
      filter.category = category;
    }

    if (tag) {
      filter.tags = tag;
    }

    const gallery = await Gallery.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .limit(10)
      .lean();

    // Get unique categories for filtering
    const categories = await Gallery.distinct("category", { isActive: true });

    res.status(200).json({
      success: true,
      data: {
        images: gallery.map((img) => ({
          id: img._id,
          src: img.src,
          title: img.title,
          category: img.category,
          location: img.location,
          span: img.span,
          description: img.description,
          isActive: img.isActive,
        })),
        categories: categories.filter(Boolean),
        totalCount: gallery.length,
        maxAllowed: 10,
      },
    });
  } catch (error) {
    console.error("Get gallery error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch gallery images.",
    });
  }
};

// @desc    Get single gallery image (public)
// @route   GET /api/gallery/:id
// @access  Public
export const getGalleryImage = async (req, res) => {
  try {
    const image = await Gallery.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Gallery image not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: image.forDisplay,
    });
  } catch (error) {
    console.error("Get gallery image error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid image ID format.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch gallery image.",
    });
  }
};

// @desc    Create gallery image (Admin only)
// @route   POST /api/admin/gallery
// @access  Private (Admin only)
export const createGalleryImage = async (req, res) => {
  try {
    const {
      title,
      src,
      category,
      location,
      description,
      span = "col-span-1",
      tags = [],
      order = 0,
    } = req.body;

    if (!title || !src) {
      return res.status(400).json({
        success: false,
        message: "Title and image source are required.",
      });
    }

    // Check current active count
    const activeCount = await Gallery.countDocuments({ isActive: true });

    if (activeCount >= 10) {
      return res.status(400).json({
        success: false,
        message:
          "Maximum 10 active gallery images allowed. Please deactivate an existing image first.",
      });
    }

    const image = await Gallery.create({
      title,
      src,
      category: category || "Uncategorized",
      location,
      description,
      span,
      tags,
      order,
    });

    res.status(201).json({
      success: true,
      message: "Gallery image created successfully.",
      data: image.forDisplay,
    });
  } catch (error) {
    console.error("Create gallery image error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((err) => err.message)
          .join(", "),
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create gallery image.",
    });
  }
};

// @desc    Update gallery image (Admin only)
// @route   PUT /api/admin/gallery/:id
// @access  Private (Admin only)
export const updateGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove protected fields
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const image = await Gallery.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Gallery image not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Gallery image updated successfully.",
      data: image.forDisplay,
    });
  } catch (error) {
    console.error("Update gallery image error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((err) => err.message)
          .join(", "),
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid image ID format.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update gallery image.",
    });
  }
};

// @desc    Delete gallery image (soft delete) (Admin only)
// @route   DELETE /api/admin/gallery/:id
// @access  Private (Admin only)
export const deleteGalleryImage = async (req, res) => {
  try {
    const image = await Gallery.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    );

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Gallery image not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Gallery image deactivated successfully.",
    });
  } catch (error) {
    console.error("Delete gallery image error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid image ID format.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete gallery image.",
    });
  }
};

// @desc    Reorder gallery images (Admin only)
// @route   PUT /api/admin/gallery/reorder
// @access  Private (Admin only)
export const reorderGallery = async (req, res) => {
  try {
    const { imageOrders } = req.body; // Array of { id, order }

    if (!Array.isArray(imageOrders)) {
      return res.status(400).json({
        success: false,
        message: "Image orders array is required.",
      });
    }

    // Update each image's order
    const updates = imageOrders.map(({ id, order }) => ({
      updateOne: {
        filter: { _id: id },
        update: { order },
      },
    }));

    await Gallery.bulkWrite(updates);

    // Get updated gallery
    const updatedGallery = await Gallery.find({ isActive: true })
      .sort({ order: 1 })
      .lean();

    res.status(200).json({
      success: true,
      message: "Gallery reordered successfully.",
      data: updatedGallery.map((img) => ({
        id: img._id,
        title: img.title,
        order: img.order,
        src: img.src,
      })),
    });
  } catch (error) {
    console.error("Reorder gallery error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reorder gallery.",
    });
  }
};

// @desc    Get all gallery images (Admin only)
// @route   GET /api/admin/gallery
// @access  Private (Admin only)
export const getAllGalleryImages = async (req, res) => {
  try {
    const { page = 1, limit = 20, isActive, category, search } = req.query;

    // Build filter
    const filter = {};

    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const [images, total] = await Promise.all([
      Gallery.find(filter)
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Gallery.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / Number(limit));

    // Get statistics
    const stats = await Gallery.aggregate([
      {
        $group: {
          _id: null,
          totalImages: { $sum: 1 },
          activeImages: {
            $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] },
          },
          categories: { $addToSet: "$category" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        images: images.map((img) => ({
          ...img,
          id: img._id,
        })),
        pagination: {
          total,
          totalPages,
          currentPage: Number(page),
          limit: Number(limit),
        },
        statistics: {
          totalImages: stats[0]?.totalImages || 0,
          activeImages: stats[0]?.activeImages || 0,
          categoryCount: stats[0]?.categories?.length || 0,
          maxAllowed: 10,
          remainingSlots: Math.max(0, 10 - (stats[0]?.activeImages || 0)),
        },
      },
    });
  } catch (error) {
    console.error("Get all gallery images error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch gallery images.",
    });
  }
};

// @desc    Upload gallery image metadata (Admin only)
// @route   POST /api/admin/gallery/upload
// @access  Private (Admin only)
export const uploadGalleryImage = async (req, res) => {
  try {
    // This is a placeholder for image upload logic
    // In production, you'd handle file upload here (multer, cloudinary, etc.)

    const { url, title } = req.body;

    if (!url || !title) {
      return res.status(400).json({
        success: false,
        message: "URL and title are required.",
      });
    }

    // Check if we can add more images
    const activeCount = await Gallery.countDocuments({ isActive: true });

    if (activeCount >= 10) {
      return res.status(400).json({
        success: false,
        message: "Maximum 10 active gallery images reached.",
      });
    }

    // Create gallery entry
    const image = await Gallery.create({
      title,
      src: url,
      category: req.body.category || "Uncategorized",
      location: req.body.location,
      description: req.body.description,
      span: req.body.span || "col-span-1",
    });

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully.",
      data: image.forDisplay,
    });
  } catch (error) {
    console.error("Upload gallery image error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload image.",
    });
  }
};

