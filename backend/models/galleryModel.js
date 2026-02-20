import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    src: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      default: "Uncategorized",
    },
    location: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    span: {
      type: String,
      enum: [
        "col-span-1",
        "col-span-2",
        "row-span-1",
        "row-span-2",
        "col-span-1 row-span-2",
        "col-span-2 row-span-1",
        "col-span-2 row-span-2",
      ],
      default: "col-span-1",
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    metadata: {
      width: Number,
      height: Number,
      size: Number,
      format: String,
    },
  },
  {
    timestamps: true,
  },
);

// Ensure max 10 active images
gallerySchema.pre("save", async function (next) {
  if (this.isActive) {
    const activeCount = await mongoose.model("Gallery").countDocuments({
      isActive: true,
      _id: { $ne: this._id },
    });

    if (activeCount >= 10) {
      next(
        new Error(
          "Maximum 10 active gallery images allowed. Please deactivate an existing image first.",
        ),
      );
    }
  }
  next();
});

// Indexes
gallerySchema.index({ category: 1 });
gallerySchema.index({ order: 1 });
gallerySchema.index({ isActive: 1 });
gallerySchema.index({ tags: 1 });

// Static method to get gallery layout
gallerySchema.statics.getLayout = async function () {
  const images = await this.find({ isActive: true })
    .sort({ order: 1, createdAt: -1 })
    .limit(10)
    .lean();

  // Group by category for filtering
  const categories = [...new Set(images.map((img) => img.category))].filter(
    Boolean,
  );

  return {
    images,
    categories,
    totalCount: images.length,
    maxAllowed: 10,
  };
};

// Virtual for formatted response
gallerySchema.virtual("forDisplay").get(function () {
  return {
    id: this._id,
    src: this.src,
    title: this.title,
    category: this.category,
    location: this.location,
    span: this.span,
    description: this.description,
  };
});

// Enable virtuals
gallerySchema.set("toJSON", { virtuals: true });
gallerySchema.set("toObject", { virtuals: true });

const Gallery = mongoose.model("Gallery", gallerySchema);
export default Gallery;
