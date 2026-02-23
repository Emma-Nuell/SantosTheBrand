import { Schema, model } from "mongoose";

const variationSchema = new Schema({
  color: {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String, // Hex color code or identifier
      trim: true,
    },
    image: {
      type: String, // Optional color-specific image
    },
  },
  size: {
    type: String,
    trim: true,
  },
  sku: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  price: {
    type: Number,
    min: 0,
  }, // Optional override price for this variation
  isActive: {
    type: Boolean,
    default: true,
  },
});

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    hoverImage: {
      type: String,
    
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      trim: true,
      default: "",
    },
    // Product variations
    hasVariations: {
      type: Boolean,
      default: false,
    },
    variations: [variationSchema],
    // Available options for filtering
    availableColors: [
      {
        name: String,
        code: String,
        image: String,
      },
    ],
    availableSizes: [
      {
        type: String,
      },
    ],
    // Global stock when no variations
    stock: {
      type: Number,
      min: 0,
      default: 0,
    },
    // Product attributes
    attributes: {
      material: String,
      care: String,
      fit: String,
      length: String,
      occasion: String,
      season: String,
    },
    // Rating system
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    // Status
    isActive: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    trending: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    // For soft delete
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for better query performance
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ tags: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ title: "text", description: "text" });

// Virtual for total stock (sum of variations or global stock)
productSchema.virtual("totalStock").get(function () {
  if (this.hasVariations && this.variations.length > 0) {
    return this.variations.reduce((sum, v) => sum + (v.stock || 0), 0);
  }
  return this.stock || 0;
});

// Virtual for minimum price
productSchema.virtual("minPrice").get(function () {
  if (this.hasVariations && this.variations.length > 0) {
    const prices = this.variations.map((v) => v.price || this.basePrice);
    return Math.min(...prices);
  }
  return this.basePrice;
});

// Virtual for maximum price
productSchema.virtual("maxPrice").get(function () {
  if (this.hasVariations && this.variations.length > 0) {
    const prices = this.variations.map((v) => v.price || this.basePrice);
    return Math.max(...prices);
  }
  return this.basePrice;
});

// Virtual for price range string
productSchema.virtual("priceRange").get(function () {
  if (this.hasVariations && this.variations.length > 0) {
    const min = this.minPrice;
    const max = this.maxPrice;
    if (min === max) {
      return `₦${min.toLocaleString()}`;
    }
    return `₦${min.toLocaleString()} - ₦${max.toLocaleString()}`;
  }
  return `₦${this.basePrice.toLocaleString()}`;
});

// Method to check if specific variation is in stock
productSchema.methods.checkVariationStock = function (
  color,
  size,
  quantity = 1,
) {
  if (!this.hasVariations || this.variations.length === 0) {
    return this.stock >= quantity;
  }

  const variation = this.variations.find(
    (v) => (!color || v.color?.name === color) && (!size || v.size === size),
  );

  if (!variation) return false;
  return variation.stock >= quantity;
};

// Method to get available variations
productSchema.methods.getAvailableVariations = function () {
  if (!this.hasVariations) {
    return {
      colors: [],
      sizes: [],
      hasBoth: false,
    };
  }

  const activeVariations = this.variations.filter(
    (v) => v.isActive && v.stock > 0,
  );

  // Extract unique colors and sizes with stock
  const colors = [
    ...new Set(
      activeVariations
        .filter((v) => v.color?.name)
        .map((v) => JSON.stringify(v.color)),
    ),
  ].map((c) => JSON.parse(c));

  const sizes = [
    ...new Set(activeVariations.filter((v) => v.size).map((v) => v.size)),
  ];

  return {
    colors,
    sizes,
    hasBoth: colors.length > 0 && sizes.length > 0,
    hasColors: colors.length > 0,
    hasSizes: sizes.length > 0,
  };
};

// Enable virtuals in JSON
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

export default model("Product", productSchema);
