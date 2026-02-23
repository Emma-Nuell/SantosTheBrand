// models/Showcase.js
import { Schema, model } from "mongoose";

const showcaseSchema = new Schema(
  {
    src: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true, // Optional field for additional context
    },
    link: {
      type: String,
      trim: true, // Optional link to redirect when clicked
    },
    order: {
      type: Number,
      default: 0,
      index: true, // For sorting slides
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// Compound index for efficient querying of active slides in order
showcaseSchema.index({ isActive: 1, order: 1 });

export default model("Showcase", showcaseSchema);
