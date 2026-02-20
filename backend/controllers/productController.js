import { Product } from "../models/index.js";

// @desc    Get product variations
// @route   GET /api/products/:id/variations
// @access  Public
export const getProductVariations = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    const variations = product.getAvailableVariations();

    res.status(200).json({
      success: true,
      data: {
        hasVariations: product.hasVariations,
        variations: product.variations.filter(v => v.isActive).map(v => ({
          color: v.color,
          size: v.size,
          stock: v.stock,
          sku: v.sku,
          price: v.price || product.basePrice
        })),
        availableOptions: variations,
        priceRange: product.priceRange
      }
    });
  } catch (error) {
    console.error('Get product variations error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product variations.'
    });
  }
};

// @desc    Check variation stock
// @route   POST /api/products/:id/check-stock
// @access  Public
export const checkVariationStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { color, size, quantity = 1 } = req.body;

    const product = await Product.findById(id);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    const inStock = product.checkVariationStock(color, size, quantity);
    
    let variationDetails = null;
    if (inStock && product.hasVariations) {
      variationDetails = product.variations.find(v => 
        (!color || v.color?.name === color) && 
        (!size || v.size === size)
      );
    }

    res.status(200).json({
      success: true,
      data: {
        inStock,
        productId: product._id,
        title: product.title,
        selectedColor: color,
        selectedSize: size,
        requestedQuantity: quantity,
        availableStock: variationDetails?.stock || product.stock,
        price: variationDetails?.price || product.basePrice
      }
    });
  } catch (error) {
    console.error('Check variation stock error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to check stock.'
    });
  }
};

// Update the createProduct method to handle variations
export const createProduct = async (req, res) => {
  try {
    const {
      title,
      basePrice,
      images,
      description,
      category,
      hasVariations = false,
      variations = [],
      stock = 0,
      attributes = {},
      tags = [],
      featured = false,
      isActive = true
    } = req.body;

    // Basic validation
    if (!title || !basePrice || !images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Title, base price, and at least one image are required.'
      });
    }

    if (basePrice <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Base price must be greater than 0.'
      });
    }

    // Validate variations if product has them
    if (hasVariations) {
      if (!Array.isArray(variations) || variations.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Variations are required when hasVariations is true.'
        });
      }

      // Extract unique colors and sizes for filtering
      const availableColors = [];
      const availableSizes = new Set();

      variations.forEach(v => {
        if (v.color?.name) {
          const colorExists = availableColors.some(c => c.name === v.color.name);
          if (!colorExists) {
            availableColors.push(v.color);
          }
        }
        if (v.size) {
          availableSizes.add(v.size);
        }
      });

      // Create product with variations
      const product = await Product.create({
        title,
        basePrice,
        images,
        description: description || '',
        category: category || '',
        hasVariations: true,
        variations: variations.map(v => ({
          ...v,
          sku: v.sku || `${title.substring(0,3)}-${Date.now()}-${Math.random().toString(36).substring(7)}`.toUpperCase()
        })),
        availableColors,
        availableSizes: Array.from(availableSizes),
        stock: 0, // Global stock is 0 when using variations
        attributes,
        tags,
        featured,
        isActive
      });

      return res.status(201).json({
        success: true,
        message: 'Product with variations created successfully.',
        data: product
      });
    }

    // Create product without variations
    const product = await Product.create({
      title,
      basePrice,
      images,
      description: description || '',
      category: category || '',
      hasVariations: false,
      stock,
      attributes,
      tags,
      featured,
      isActive
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create product.'
    });
  }
};

// Update the updateProduct method to handle variations
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Prevent updating protected fields
    delete updateData._id;
    delete updateData.rating;
    delete updateData.reviewCount;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    // Handle variations update
    if (updateData.variations) {
      updateData.hasVariations = true;
      
      // Regenerate available colors and sizes
      const availableColors = [];
      const availableSizes = new Set();

      updateData.variations.forEach(v => {
        if (v.color?.name) {
          const colorExists = availableColors.some(c => c.name === v.color.name);
          if (!colorExists) {
            availableColors.push(v.color);
          }
        }
        if (v.size) {
          availableSizes.add(v.size);
        }
      });

      updateData.availableColors = availableColors;
      updateData.availableSizes = Array.from(availableSizes);
    }

    // Validate price if provided
    if (updateData.basePrice && updateData.basePrice <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Base price must be greater than 0.'
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update product.'
    });
  }
};

// @desc    Update variation stock (Admin only)
// @route   PUT /api/admin/products/:productId/variations/:variationId/stock
// @access  Private (Admin only)
export const updateVariationStock = async (req, res) => {
  try {
    const { productId, variationId } = req.params;
    const { stock } = req.body;

    if (stock === undefined || stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid stock quantity is required.'
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    if (!product.hasVariations) {
      return res.status(400).json({
        success: false,
        message: 'Product does not have variations.'
      });
    }

    const variation = product.variations.id(variationId);
    if (!variation) {
      return res.status(404).json({
        success: false,
        message: 'Variation not found.'
      });
    }

    variation.stock = stock;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Variation stock updated successfully.',
      data: variation
    });
  } catch (error) {
    console.error('Update variation stock error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update variation stock.'
    });
  }
};

// @desc    Bulk update variation stocks (Admin only)
// @route   PUT /api/admin/products/:productId/variations/bulk-stock
// @access  Private (Admin only)
export const bulkUpdateVariationStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { variations } = req.body;

    if (!Array.isArray(variations) || variations.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Variations array is required.'
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    if (!product.hasVariations) {
      return res.status(400).json({
        success: false,
        message: 'Product does not have variations.'
      });
    }

    // Update each variation
    variations.forEach(update => {
      const variation = product.variations.id(update.id);
      if (variation && update.stock !== undefined) {
        variation.stock = update.stock;
      }
    });

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Variation stocks updated successfully.',
      data: product.variations
    });
  } catch (error) {
    console.error('Bulk update variation stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update variation stocks.'
    });
  }
};

// @desc    Get low stock products (Admin only)
// @route   GET /api/admin/products/low-stock
// @access  Private (Admin only)
export const getLowStockProducts = async (req, res) => {
  try {
    const { threshold = 5 } = req.query;

    // Find products with low stock
    const products = await Product.find({
      $or: [
        // Products without variations
        { hasVariations: false, stock: { $lt: Number(threshold), $gt: 0 } },
        // Products with variations where any variation has low stock
        { 
          hasVariations: true,
          'variations.stock': { $lt: Number(threshold), $gt: 0 }
        }
      ],
      isActive: true
    }).select('title basePrice stock variations hasVariations images');

    // Format response
    const lowStockItems = [];

    products.forEach(product => {
      if (product.hasVariations) {
        // Check each variation
        product.variations.forEach(variation => {
          if (variation.isActive && variation.stock < Number(threshold) && variation.stock > 0) {
            lowStockItems.push({
              productId: product._id,
              productTitle: product.title,
              productImage: product.images[0],
              variation: {
                id: variation._id,
                color: variation.color,
                size: variation.size,
                stock: variation.stock,
                sku: variation.sku
              },
              threshold
            });
          }
        });
      } else {
        // Product without variations
        if (product.stock < Number(threshold) && product.stock > 0) {
          lowStockItems.push({
            productId: product._id,
            productTitle: product.title,
            productImage: product.images[0],
            stock: product.stock,
            threshold
          });
        }
      }
    });

    // Also get out of stock items
    const outOfStock = await Product.find({
      $or: [
        { hasVariations: false, stock: 0 },
        { hasVariations: true, 'variations.stock': 0 }
      ],
      isActive: true
    }).countDocuments();

    res.status(200).json({
      success: true,
      data: {
        lowStockItems,
        totalLowStock: lowStockItems.length,
        outOfStock,
        threshold: Number(threshold)
      }
    });
  } catch (error) {
    console.error('Get low stock products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch low stock products.'
    });
  }
};


// @desc    Get all products (with filtering)
// @route   GET /api/products
// @access  Public
export const getAllProducts = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
      activeOnly = true
    } = req.query;

    // Build filter object
    const filter = {};

    // Only show active products by default
    if (activeOnly === 'true' || activeOnly === true) {
      filter.isActive = true;
    }

    // Filter by category
    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Search in title and description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort configuration
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Product.countDocuments(filter)
    ]);

    // Calculate total pages
    const totalPages = Math.ceil(total / Number(limit));

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages,
      currentPage: Number(page),
      data: products
    });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products.'
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    // Check if product is active (unless admin is viewing)
    if (!product.isActive && !req.admin) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product by ID error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product.'
    });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter = {
      category: { $regex: category, $options: 'i' },
      isActive: true
    };

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Product.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / Number(limit));

    res.status(200).json({
      success: true,
      category,
      count: products.length,
      total,
      totalPages,
      currentPage: Number(page),
      data: products
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products by category.'
    });
  }
};

// @desc    Get all categories
// @route   GET /api/products/categories/all
// @access  Public
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isActive: true })
      .then(cats => cats.filter(cat => cat && cat.trim() !== ''))
      .then(cats => cats.sort());

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error('Get all categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories.'
    });
  }
};


// @desc    Delete product (soft delete by setting isActive to false)
// @route   DELETE /api/products/:id
// @access  Private (Admin only)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deactivated successfully.',
      data: product
    });
  } catch (error) {
    console.error('Delete product error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete product.'
    });
  }
};

// @desc    Activate product
// @route   PUT /api/products/:id/activate
// @access  Private (Admin only)
export const activateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product activated successfully.',
      data: product
    });
  } catch (error) {
    console.error('Activate product error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to activate product.'
    });
  }
};

// @desc    Bulk update products
// @route   PUT /api/products/bulk/update
// @access  Private (Admin only)
export const bulkUpdateProducts = async (req, res) => {
  try {
    const { productIds, updateData } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Product IDs array is required.'
      });
    }

    // Prevent updating protected fields
    delete updateData._id;
    delete updateData.rating;
    delete updateData.reviewCount;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    // Validate price if provided
    if (updateData.price && updateData.price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be greater than 0.'
      });
    }

    // Update products
    const result = await Product.updateMany(
      { _id: { $in: productIds } },
      updateData,
      { runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} product(s) updated successfully.`,
      data: {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
      }
    });
  } catch (error) {
    console.error('Bulk update products error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update products.'
    });
  }
};

// @desc    Get product statistics
// @route   GET /api/products/statistics
// @access  Private (Admin only)
export const getProductStatistics = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          activeProducts: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
          inactiveProducts: { $sum: { $cond: [{ $eq: ['$isActive', false] }, 1, 0] } },
          averagePrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          totalCategories: { $addToSet: '$category' }
        }
      },
      {
        $project: {
          _id: 0,
          totalProducts: 1,
          activeProducts: 1,
          inactiveProducts: 1,
          averagePrice: { $round: ['$averagePrice', 2] },
          minPrice: 1,
          maxPrice: 1,
          categoryCount: { $size: '$totalCategories' }
        }
      }
    ]);

    // Get category distribution
    const categoryStats = await Product.aggregate([
      { $match: { isActive: true, category: { $ne: '', $exists: true } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || {
          totalProducts: 0,
          activeProducts: 0,
          inactiveProducts: 0,
          averagePrice: 0,
          minPrice: 0,
          maxPrice: 0,
          categoryCount: 0
        },
        categories: categoryStats
      }
    });
  } catch (error) {
    console.error('Get product statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product statistics.'
    });
  }
};


// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res) => {
  try {
    const {
      limit = 10,
      category,
      excludeOutOfStock = true
    } = req.query;

    // Build filter
    const filter = {
      featured: true,
      isActive: true
    };

    // Filter by category if provided
    if (category) {
      filter.category = category;
    }

    // Exclude out of stock if requested
    if (excludeOutOfStock === 'true' || excludeOutOfStock === true) {
      filter.$or = [
        { hasVariations: false, stock: { $gt: 0 } },
        { hasVariations: true, 'variations.stock': { $gt: 0 } }
      ];
    }

    // Get featured products
    const products = await Product.find(filter)
      .sort({ createdAt: -1, rating: -1 })
      .limit(Number(limit))
      .lean();

    // Enhance products with variation info
    const enhancedProducts = products.map(product => ({
      ...product,
      priceRange: product.priceRange,
      totalStock: product.totalStock,
      availableOptions: product.hasVariations ? product.getAvailableVariations() : null
    }));

    // Get total count for metadata
    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: enhancedProducts.length,
      total,
      data: enhancedProducts,
      meta: {
        type: 'featured',
        limit: Number(limit),
        category: category || 'all'
      }
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured products.'
    });
  }
};

// @desc    Get trending products
// @route   GET /api/products/trending
// @access  Public
export const getTrendingProducts = async (req, res) => {
  try {
    const {
      limit = 10,
      category,
      excludeOutOfStock = true,
      minRating = 3.5
    } = req.query;

    // Build filter
    const filter = {
      trending: true,
      isActive: true,
      rating: { $gte: Number(minRating) }
    };

    // Filter by category if provided
    if (category) {
      filter.category = category;
    }

    // Exclude out of stock if requested
    if (excludeOutOfStock === 'true' || excludeOutOfStock === true) {
      filter.$or = [
        { hasVariations: false, stock: { $gt: 0 } },
        { hasVariations: true, 'variations.stock': { $gt: 0 } }
      ];
    }

    // Get trending products (sort by rating and review count to determine "trending")
    const products = await Product.find(filter)
      .sort({ rating: -1, reviewCount: -1, createdAt: -1 })
      .limit(Number(limit))
      .lean();

    // Enhance products with variation info
    const enhancedProducts = products.map(product => ({
      ...product,
      priceRange: product.priceRange,
      totalStock: product.totalStock,
      availableOptions: product.hasVariations ? product.getAvailableVariations() : null,
      trendingScore: ((product.rating * product.reviewCount) / (product.reviewCount + 1)).toFixed(2)
    }));

    // Get total count for metadata
    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: enhancedProducts.length,
      total,
      data: enhancedProducts,
      meta: {
        type: 'trending',
        limit: Number(limit),
        category: category || 'all',
        minRating: Number(minRating)
      }
    });
  } catch (error) {
    console.error('Get trending products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trending products.'
    });
  }
};

// @desc    Get both featured and trending products in one call
// @route   GET /api/products/featured-trending
// @access  Public
export const getFeaturedAndTrending = async (req, res) => {
  try {
    const {
      featuredLimit = 10,
      trendingLimit = 10,
      category,
      excludeOutOfStock = true
    } = req.query;

    // Common filter base
    const baseFilter = { isActive: true };
    if (category) {
      baseFilter.category = category;
    }
    if (excludeOutOfStock === 'true' || excludeOutOfStock === true) {
      baseFilter.$or = [
        { hasVariations: false, stock: { $gt: 0 } },
        { hasVariations: true, 'variations.stock': { $gt: 0 } }
      ];
    }

    // Run both queries in parallel
    const [featured, trending] = await Promise.all([
      Product.find({ ...baseFilter, featured: true })
        .sort({ createdAt: -1, rating: -1 })
        .limit(Number(featuredLimit))
        .lean(),
      
      Product.find({ 
        ...baseFilter, 
        trending: true,
        rating: { $gte: 3.5 }
      })
        .sort({ rating: -1, reviewCount: -1, createdAt: -1 })
        .limit(Number(trendingLimit))
        .lean()
    ]);

    // Enhance featured products
    const enhancedFeatured = featured.map(product => ({
      ...product,
      priceRange: product.priceRange,
      totalStock: product.totalStock,
      availableOptions: product.hasVariations ? product.getAvailableVariations() : null
    }));

    // Enhance trending products
    const enhancedTrending = trending.map(product => ({
      ...product,
      priceRange: product.priceRange,
      totalStock: product.totalStock,
      availableOptions: product.hasVariations ? product.getAvailableVariations() : null,
      trendingScore: ((product.rating * product.reviewCount) / (product.reviewCount + 1)).toFixed(2)
    }));

    res.status(200).json({
      success: true,
      data: {
        featured: {
          count: enhancedFeatured.length,
          products: enhancedFeatured
        },
        trending: {
          count: enhancedTrending.length,
          products: enhancedTrending
        }
      },
      meta: {
        category: category || 'all',
        featuredLimit: Number(featuredLimit),
        trendingLimit: Number(trendingLimit)
      }
    });
  } catch (error) {
    console.error('Get featured and trending error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured and trending products.'
    });
  }
};

// @desc    Set product as featured (Admin only)
// @route   PUT /api/admin/products/:id/featured
// @access  Private (Admin only)
export const setProductFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const { featured } = req.body;

    if (typeof featured !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Featured must be a boolean value.'
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { featured },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: `Product ${featured ? 'marked as' : 'removed from'} featured.`,
      data: {
        id: product._id,
        title: product.title,
        featured: product.featured
      }
    });
  } catch (error) {
    console.error('Set product featured error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update featured status.'
    });
  }
};

// @desc    Set product as trending (Admin only)
// @route   PUT /api/admin/products/:id/trending
// @access  Private (Admin only)
export const setProductTrending = async (req, res) => {
  try {
    const { id } = req.params;
    const { trending } = req.body;

    if (typeof trending !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Trending must be a boolean value.'
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { trending },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: `Product ${trending ? 'marked as' : 'removed from'} trending.`,
      data: {
        id: product._id,
        title: product.title,
        trending: product.trending
      }
    });
  } catch (error) {
    console.error('Set product trending error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update trending status.'
    });
  }
};

// @desc    Bulk set featured/trending (Admin only)
// @route   PUT /api/admin/products/bulk/feature-trend
// @access  Private (Admin only)
export const bulkSetFeatureTrend = async (req, res) => {
  try {
    const { productIds, featured, trending } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Product IDs array is required.'
      });
    }

    const updateData = {};
    if (typeof featured === 'boolean') {
      updateData.featured = featured;
    }
    if (typeof trending === 'boolean') {
      updateData.trending = trending;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one field (featured or trending) must be provided.'
      });
    }

    const result = await Product.updateMany(
      { _id: { $in: productIds } },
      updateData
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} product(s) updated successfully.`,
      data: {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
        updates: updateData
      }
    });
  } catch (error) {
    console.error('Bulk set feature/trend error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update products.'
    });
  }
};

// @desc    Get featured/trending statistics (Admin only)
// @route   GET /api/admin/products/feature-trend-stats
// @access  Private (Admin only)
export const getFeatureTrendStats = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $facet: {
          featured: [
            { $match: { featured: true, isActive: true } },
            { $count: 'count' }
          ],
          trending: [
            { $match: { trending: true, isActive: true } },
            { $count: 'count' }
          ],
          both: [
            { $match: { featured: true, trending: true, isActive: true } },
            { $count: 'count' }
          ],
          byCategory: [
            { $match: { isActive: true } },
            {
              $group: {
                _id: '$category',
                featured: { $sum: { $cond: [{ $eq: ['$featured', true] }, 1, 0] } },
                trending: { $sum: { $cond: [{ $eq: ['$trending', true] }, 1, 0] } },
                total: { $sum: 1 }
              }
            },
            { $sort: { total: -1 } }
          ]
        }
      }
    ]);

    const result = stats[0];

    res.status(200).json({
      success: true,
      data: {
        counts: {
          featured: result.featured[0]?.count || 0,
          trending: result.trending[0]?.count || 0,
          both: result.both[0]?.count || 0
        },
        byCategory: result.byCategory.filter(c => c._id && c._id !== ''),
        totalActiveProducts: await Product.countDocuments({ isActive: true })
      }
    });
  } catch (error) {
    console.error('Get feature/trend stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics.'
    });
  }
};
