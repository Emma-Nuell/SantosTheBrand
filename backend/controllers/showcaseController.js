// controllers/showcaseController.js

import { Showcase } from "../models/index.js";
import { validationResult } from "express-validator";
import mongoose from "mongoose";

// @desc    Create a new showcase slide
// @route   POST /api/showcase
// @access  Private (Admin/SuperAdmin)
export const createShowcaseSlide = async (req, res) => {
  try {
    const { src, title, description, link, order } = req.body;

    // Create new showcase slide
    const slide = await Showcase.create({
      src,
      title,
      description: description || "",
      link: link || "",
      order: order || 0,
    });

    res.status(201).json({
      success: true,
      message: "Showcase slide created successfully",
      data: slide,
    });
  } catch (error) {
    console.error("Create showcase slide error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating showcase slide",
      error: error.message,
    });
  }
};

// @desc    Get all active showcase slides for slideshow
// @route   GET /api/showcase/slideshow
// @access  Public
export const getSlideshow = async (req, res) => {
  try {
    const slides = await Showcase.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .select("src title description link");

    res.status(200).json({
      success: true,
      count: slides.length,
      data: slides,
    });
  } catch (error) {
    console.error("Get slideshow error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching slideshow",
      error: error.message,
    });
  }
};

// @desc    Get all showcase slides (with pagination)
// @route   GET /api/showcase
// @access  Public (or Private if you want admin only)
export const getAllSlides = async (req, res) => {
  try {
    const { page = 1, limit = 20, isActive } = req.query;

    // Build filter
    const filter = {};
    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const slides = await Showcase.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalSlides = await Showcase.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: slides.length,
      total: totalSlides,
      totalPages: Math.ceil(totalSlides / parseInt(limit)),
      currentPage: parseInt(page),
      data: slides,
    });
  } catch (error) {
    console.error("Get all slides error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching showcase slides",
      error: error.message,
    });
  }
};

// @desc    Get single showcase slide by ID
// @route   GET /api/showcase/:id
// @access  Public
export const getSlideById = async (req, res) => {
  try {
    const { id } = req.params;

    const slide = await Showcase.findById(id);

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: "Showcase slide not found",
      });
    }

    res.status(200).json({
      success: true,
      data: slide,
    });
  } catch (error) {
    console.error("Get slide by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching showcase slide",
      error: error.message,
    });
  }
};

// @desc    Update showcase slide
// @route   PUT /api/showcase/:id
// @access  Private (Admin/SuperAdmin)
export const updateShowcaseSlide = async (req, res) => {
  try {
    const { id } = req.params;

    const slide = await Showcase.findById(id);

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: "Showcase slide not found",
      });
    }

    // Update fields
    const updateFields = [
      "src",
      "title",
      "description",
      "link",
      "order",
      "isActive",
    ];

    updateFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        slide[field] = req.body[field];
      }
    });

    const updatedSlide = await slide.save();

    res.status(200).json({
      success: true,
      message: "Showcase slide updated successfully",
      data: updatedSlide,
    });
  } catch (error) {
    console.error("Update showcase slide error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating showcase slide",
      error: error.message,
    });
  }
};

// @desc    Delete showcase slide
// @route   DELETE /api/showcase/:id
// @access  Private (Admin/SuperAdmin)
export const deleteShowcaseSlide = async (req, res) => {
  try {
    const { id } = req.params;

    const slide = await Showcase.findById(id);

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: "Showcase slide not found",
      });
    }

    await slide.deleteOne();

    res.status(200).json({
      success: true,
      message: "Showcase slide deleted successfully",
    });
  } catch (error) {
    console.error("Delete showcase slide error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting showcase slide",
      error: error.message,
    });
  }
};

// @desc    Toggle slide active status
// @route   PATCH /api/showcase/:id/toggle
// @access  Private (Admin/SuperAdmin)
export const toggleSlideStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const slide = await Showcase.findById(id);

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: "Showcase slide not found",
      });
    }

    slide.isActive = !slide.isActive;
    await slide.save();

    res.status(200).json({
      success: true,
      message: `Slide ${slide.isActive ? "activated" : "deactivated"} successfully`,
      data: slide,
    });
  } catch (error) {
    console.error("Toggle slide status error:", error);
    res.status(500).json({
      success: false,
      message: "Error toggling slide status",
      error: error.message,
    });
  }
};

// @desc    Reorder slides
// @route   POST /api/showcase/reorder
// @access  Private (Admin/SuperAdmin)
export const reorderSlides = async (req, res) => {
  try {
    const { slides } = req.body; // Array of { id, order }

    if (!Array.isArray(slides) || slides.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of slides with order values",
      });
    }

    // Update each slide's order
    const updatePromises = slides.map(({ id, order }) => {
      return Showcase.findByIdAndUpdate(id, { order }, { new: true });
    });

    const updatedSlides = await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: "Slides reordered successfully",
      data: updatedSlides,
    });
  } catch (error) {
    console.error("Reorder slides error:", error);
    res.status(500).json({
      success: false,
      message: "Error reordering slides",
      error: error.message,
    });
  }
};

// @desc    Get slideshow settings/stats
// @route   GET /api/showcase/stats
// @access  Private (Admin/SuperAdmin)
export const getShowcaseStats = async (req, res) => {
  try {
    const [totalSlides, activeSlides, inactiveSlides] = await Promise.all([
      Showcase.countDocuments(),
      Showcase.countDocuments({ isActive: true }),
      Showcase.countDocuments({ isActive: false }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalSlides,
        activeSlides,
        inactiveSlides,
        slideshowSpeed: "Configurable per slide",
      },
    });
  } catch (error) {
    console.error("Get showcase stats error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching showcase statistics",
      error: error.message,
    });
  }
};
