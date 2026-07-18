import { Order, Product, Settings, PromoCode } from "../models/index.js";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import paystackService from "../service/paystackService.js";
import { calculateTotalAmount } from "../utils/paystackFees.js";

// @desc    Create a new order (Guest checkout)
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      paymentMethod,
      promoCode,
      notes,
    } = req.body;

    // Basic validation
    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !shippingAddress ||
      !items ||
      !paymentMethod
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: name, email, phone, address, items, or payment method.",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Items must be a non-empty array.",
      });
    }

    // Validate shipping address
    const { street, city, state } = shippingAddress;
    if (!street || !city || !state) {
      return res.status(400).json({
        success: false,
        message: "Complete shipping address is required.",
      });
    }

    // Validate payment method
    if (!["paystack", "delivery"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method. Use "paystack" or "delivery".',
      });
    }

    // Calculate total and validate items
    let subtotalAmount = 0;
    const validatedItems = [];
    const productUpdates = [];

    for (const item of items) {
      const { productId, quantity, color, size } = item;

      if (!productId || !quantity || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Each item must have a productId and quantity (min 1).",
        });
      }

      // Get product details
      const product = await Product.findOne({
        _id: productId,
        isActive: true,
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${productId} not found or unavailable.`,
        });
      }

      let itemPrice = product.basePrice;
      let variationDetail = null;

      if (product.hasVariations && product.variations.length > 0) {
        // Find the matching variation by color and/or size
        const variation = product.variations.find(
          (v) =>
            v.isActive &&
            (!color || v.color?.name === color) &&
            (!size || v.size === size),
        );

        if (!variation) {
          return res.status(400).json({
            success: false,
            message: `Variation (color: ${color || "any"}, size: ${size || "any"}) not found for "${product.title}".`,
          });
        }

        // Check variation stock
        if (variation.stock < quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for "${product.title}" (${color || ""}${color && size ? " / " : ""}${size || ""}). Available: ${variation.stock}`,
          });
        }

        // Use variation price if set, otherwise fall back to basePrice
        itemPrice = variation.price ?? product.basePrice;

        // Store variation details for the order item
        variationDetail = {
          color: variation.color?.name || null,
          size: variation.size || null,
          sku: variation.sku || null,
        };

        // Prepare stock decrement (deferred for paystack, immediate for delivery)
        productUpdates.push({
          updateOne: {
            filter: { _id: product._id, "variations._id": variation._id },
            update: { $inc: { "variations.$.stock": -quantity } },
          },
        });
      } else {
        // No variations — use global stock
        if (product.stock < quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for "${product.title}". Available: ${product.stock}`,
          });
        }

        // Prepare stock decrement
        productUpdates.push({
          updateOne: {
            filter: { _id: product._id },
            update: { $inc: { stock: -quantity } },
          },
        });
      }

      // Calculate item total
      const itemTotal = itemPrice * quantity;
      subtotalAmount += itemTotal;

      // Build validated item
      const orderItem = {
        productId: product._id,
        title: product.title,
        price: itemPrice,
        quantity,
        image: product.images[0] || null,
      };

      if (variationDetail) {
        orderItem.variation = variationDetail;
      }

      validatedItems.push(orderItem);
    }

    // Validate and apply promo code
    let discountAmount = 0;
    let promoValidation = null;

    if (promoCode) {
      // Get promo code from database
      const promo = await PromoCode.findOne({
        code: promoCode.toUpperCase(),
        isActive: true,
      });

      if (promo) {
        // Validate promo code
        promoValidation = promo.validateAndApply(
          subtotalAmount,
          validatedItems,
          customerEmail,
        );

        if (promoValidation.valid) {
          discountAmount = promoValidation.discountAmount;

          // Check per user limit
          if (promo.perUserLimit) {
            const userUsage = await Order.countDocuments({
              customerEmail: customerEmail.toLowerCase(),
              "promoCode.code": promo.code,
            });

            if (userUsage >= promo.perUserLimit) {
              return res.status(400).json({
                success: false,
                message:
                  "You have reached the usage limit for this promo code.",
              });
            }
          }

          // Increment promo usage
          promo.usedCount += 1;
          await promo.save();
        }
      }
    }

    // Calculate shipping fee (matches frontend logic)
    const shippingFee = 0; // Shipping is handled by frontend/delivery method

    // Calculate base amount (subtotal + shipping - discount)
    const baseAmount = Math.round((subtotalAmount + shippingFee - discountAmount) * 100) / 100;

    // Calculate fees based on payment method
    let paystackFee = 0;
    let totalAmount = baseAmount;

    if (paymentMethod === "paystack") {
      const feeCalc = calculateTotalAmount(baseAmount);
      paystackFee = feeCalc.paystackFee;
      totalAmount = feeCalc.totalAmount;
    }

    // Create order
    const orderData = {
      customerName: customerName.trim(),
      customerEmail: customerEmail.toLowerCase().trim(),
      customerPhone: customerPhone.trim(),
      shippingAddress,
      items: validatedItems,
      subtotalAmount: Math.round(subtotalAmount * 100) / 100,
      shippingFee,
      paystackFee,
      totalAmount,
      paymentMethod,
      paymentStatus: "pending",
      orderStatus: paymentMethod === "paystack" ? "awaiting_payment" : "processing",
      notes: notes || "",
      orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    };

    // Add promo code data if valid
    if (promoValidation && promoValidation.valid) {
      orderData.promoCode = {
        code: promoCode,
        discountAmount,
        discountType: promoValidation.type,
        discountValue: promoValidation.value,
      };
    }

    // For delivery payment, decrement stock immediately
    if (paymentMethod === "delivery" && productUpdates.length > 0) {
      await Product.bulkWrite(productUpdates);
    }

    // Save order to database
    const order = await Order.create(orderData);

    // Prepare response based on payment method
    let responseData = {
      success: true,
      message: "Order created successfully.",
      data: {
        order: {
          id: order._id,
          orderNumber: order.orderNumber,
          subtotalAmount: order.subtotalAmount,
          shippingFee: order.shippingFee,
          paystackFee: order.paystackFee,
          totalAmount: order.totalAmount,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          orderStatus: order.orderStatus,
          createdAt: order.createdAt,
        },
      },
    };

    // If Paystack payment, initialize transaction
    if (paymentMethod === "paystack") {
      const paystackReference = `PSK-${Date.now()}-${uuidv4().slice(0, 8)}`;

      // Store the reference on the order
      order.paystackReference = paystackReference;
      await order.save();

      // Initialize Paystack transaction
      const paystackResult = await paystackService.initializeTransaction(
        customerEmail,
        totalAmount,
        paystackReference,
        {
          orderId: order._id.toString(),
          orderNumber: order.orderNumber,
          custom_fields: [
            {
              display_name: "Order Number",
              variable_name: "order_number",
              value: order.orderNumber,
            },
          ],
        },
      );

      if (!paystackResult.success) {
        // Paystack initialization failed — cancel the order
        order.paymentStatus = "failed";
        order.orderStatus = "cancelled";
        await order.save();

        return res.status(502).json({
          success: false,
          message: paystackResult.error || "Failed to initialize payment. Please try again.",
        });
      }

      responseData.data.payment = {
        reference: paystackReference,
        authorization_url: paystackResult.data.authorization_url,
        access_code: paystackResult.data.access_code,
      };
    }

    // TODO: Send order confirmation email

    res.status(201).json(responseData);
  } catch (error) {
    console.error("Create order error:", error);

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
      message: "Failed to create order. Please try again.",
    });
  }
};


// @desc    Get order by ID or order number
// @route   GET /api/orders/:identifier
// @access  Public (with email verification)
export const getOrder = async (req, res) => {
  try {
    const { identifier } = req.params;
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required to view order details.",
      });
    }

    // Find order by ID or order number
    const order = await Order.findOne({
      $or: [{ _id: identifier }, { orderNumber: identifier }],
      customerEmail: email.toLowerCase(),
    }).populate("items.productId", "title images");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or email does not match.",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get order error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid order identifier.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch order details.",
    });
  }
};

// @desc    Get all orders for a customer by email
// @route   GET /api/orders
// @access  Public (with email verification)
export const getOrders = async (req, res) => {
  try {
    const { email, page = 1, limit = 10 } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required to view orders.",
      });
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find({ customerEmail: email.toLowerCase() })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("items.productId", "title images"),
      Order.countDocuments({ customerEmail: email.toLowerCase() }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          total,
          totalPages: Math.ceil(total / Number(limit)),
          currentPage: Number(page),
          limit: Number(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders.",
    });
  }
};

// @desc    Verify Paystack payment (frontend calls this after redirect)
// @route   POST /api/orders/verify-payment
// @access  Public
export const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.body;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Payment reference is required.",
      });
    }

    // Find order by Paystack reference
    const order = await Order.findOne({
      paystackReference: reference,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found for this payment reference.",
      });
    }

    // Idempotency: if already completed, just return success
    if (order.paymentStatus === "completed") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified.",
        data: {
          orderId: order._id,
          orderNumber: order.orderNumber,
          paymentStatus: order.paymentStatus,
          orderStatus: order.orderStatus,
        },
      });
    }

    // Call Paystack API to verify the transaction
    const verifyResult = await paystackService.verifyTransaction(reference);

    if (!verifyResult.success) {
      return res.status(502).json({
        success: false,
        message: verifyResult.error || "Could not verify payment with Paystack.",
      });
    }

    const paystackData = verifyResult.data;

    // Check if payment was successful
    if (paystackData.status === "success") {
      // Verify amount matches (Paystack returns amount in kobo)
      const expectedKobo = Math.round(order.totalAmount * 100);
      if (paystackData.amount !== expectedKobo) {
        console.error(
          `Amount mismatch for order ${order.orderNumber}: expected ${expectedKobo}, got ${paystackData.amount}`,
        );
        order.paymentStatus = "failed";
        order.orderStatus = "cancelled";
        order.$push = {
          paymentLogs: {
            type: "amount_mismatch",
            data: { expected: expectedKobo, received: paystackData.amount },
            timestamp: new Date(),
          },
        };
        await order.save();

        return res.status(400).json({
          success: false,
          message: "Payment amount does not match order total.",
        });
      }

      // Payment verified — update order and decrement stock
      order.paymentStatus = "completed";
      order.orderStatus = "processing";
      order.paymentLogs.push({
        type: "charge_success_verified",
        data: {
          reference: paystackData.reference,
          amount: paystackData.amount,
          channel: paystackData.channel,
          paid_at: paystackData.paid_at,
        },
        timestamp: new Date(),
      });
      await order.save();

      // Decrement stock now that payment is confirmed
      await decrementStockForOrder(order);

      // TODO: Send payment confirmation email

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully.",
        data: {
          orderId: order._id,
          orderNumber: order.orderNumber,
          paymentStatus: "completed",
          orderStatus: "processing",
        },
      });
    } else {
      // Payment failed or pending
      order.paymentStatus = "failed";
      order.orderStatus = "cancelled";
      order.paymentLogs.push({
        type: "charge_failed_verified",
        data: paystackData,
        timestamp: new Date(),
      });
      await order.save();

      return res.status(200).json({
        success: true,
        message: "Payment was not successful.",
        data: {
          orderId: order._id,
          orderNumber: order.orderNumber,
          paymentStatus: "failed",
          orderStatus: "cancelled",
        },
      });
    }
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify payment.",
    });
  }
};

// @desc    Paystack webhook handler
// @route   POST /api/webhooks/paystack
// @access  Public (Paystack calls this)
export const paystackWebhook = async (req, res) => {
  try {
    // Verify webhook signature using raw body
    const signature = req.headers["x-paystack-signature"];

    if (!signature) {
      return res
        .status(401)
        .json({ success: false, message: "No signature provided" });
    }

    // req.body is raw Buffer when using express.raw()
    const rawBody = req.body.toString("utf8");
    const isValid = paystackService.verifyWebhookSignature(signature, rawBody);

    if (!isValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid signature" });
    }

    const event = JSON.parse(rawBody);

    // Handle different Paystack events
    switch (event.event) {
      case "charge.success":
        await handleSuccessfulCharge(event.data);
        break;

      case "charge.failed":
        await handleFailedCharge(event.data);
        break;

      case "transfer.success":
        // Handle successful transfer to vendor
        break;

      default:
        console.log(`Unhandled Paystack event: ${event.event}`);
    }

    // Always return 200 to acknowledge receipt
    res.status(200).json({ success: true, message: "Webhook received" });
  } catch (error) {
    console.error("Paystack webhook error:", error);
    // Still return 200 so Paystack doesn't retry
    res.status(200).json({ success: true, message: "Webhook received" });
  }
};

// Helper: Decrement stock for a confirmed order
const decrementStockForOrder = async (order) => {
  try {
    const productUpdates = [];

    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      if (item.variation && product.hasVariations) {
        // Find matching variation
        const variation = product.variations.find(
          (v) =>
            (!item.variation.color || v.color?.name === item.variation.color) &&
            (!item.variation.size || v.size === item.variation.size),
        );

        if (variation) {
          productUpdates.push({
            updateOne: {
              filter: { _id: product._id, "variations._id": variation._id },
              update: { $inc: { "variations.$.stock": -item.quantity } },
            },
          });
        }
      } else {
        productUpdates.push({
          updateOne: {
            filter: { _id: product._id },
            update: { $inc: { stock: -item.quantity } },
          },
        });
      }
    }

    if (productUpdates.length > 0) {
      await Product.bulkWrite(productUpdates);
    }
  } catch (error) {
    console.error("Decrement stock error:", error);
  }
};

// Handle successful charge (webhook)
const handleSuccessfulCharge = async (chargeData) => {
  try {
    const order = await Order.findOne({ paystackReference: chargeData.reference });

    if (!order) {
      console.error(`Webhook: No order found for reference ${chargeData.reference}`);
      return;
    }

    // Idempotency: skip if already completed
    if (order.paymentStatus === "completed") {
      console.log(`Webhook: Order ${order.orderNumber} already completed, skipping.`);
      return;
    }

    order.paymentStatus = "completed";
    order.orderStatus = "processing";
    order.paymentLogs.push({
      type: "webhook_charge_success",
      data: {
        reference: chargeData.reference,
        amount: chargeData.amount,
        channel: chargeData.channel,
        paid_at: chargeData.paid_at,
      },
      timestamp: new Date(),
    });
    await order.save();

    // Decrement stock
    await decrementStockForOrder(order);

    console.log(`Webhook: Payment completed for order ${order.orderNumber}`);
    // TODO: Send payment confirmation email
  } catch (error) {
    console.error("Handle successful charge error:", error);
  }
};

// Handle failed charge (webhook)
const handleFailedCharge = async (chargeData) => {
  try {
    const order = await Order.findOne({ paystackReference: chargeData.reference });

    if (!order) return;

    // Idempotency: skip if already completed (don't reverse a successful payment)
    if (order.paymentStatus === "completed") return;

    order.paymentStatus = "failed";
    order.orderStatus = "cancelled";
    order.paymentLogs.push({
      type: "webhook_charge_failed",
      data: chargeData,
      timestamp: new Date(),
    });
    await order.save();

    console.log(`Webhook: Payment failed for order ${order.orderNumber}`);
    // TODO: Send payment failure email
  } catch (error) {
    console.error("Handle failed charge error:", error);
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/admin/orders
// @access  Private (Admin only)
export const getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      paymentStatus,
      paymentMethod,
      startDate,
      endDate,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter
    const filter = {};

    if (status) {
      filter.orderStatus = status;
    }

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    if (paymentMethod) {
      filter.paymentMethod = paymentMethod;
    }

    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Search filter
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { customerName: { $regex: search, $options: "i" } },
        { customerEmail: { $regex: search, $options: "i" } },
        { "shippingAddress.city": { $regex: search, $options: "i" } },
      ];
    }

    // Sort configuration
    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute queries
    const [orders, total, stats] = await Promise.all([
      Order.find(filter).sort(sort).skip(skip).limit(Number(limit)).lean(),
      Order.countDocuments(filter),
      Order.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: "$totalAmount" },
            pendingOrders: {
              $sum: { $cond: [{ $eq: ["$orderStatus", "processing"] }, 1, 0] },
            },
            completedOrders: {
              $sum: { $cond: [{ $eq: ["$orderStatus", "delivered"] }, 1, 0] },
            },
            averageOrderValue: { $avg: "$totalAmount" },
          },
        },
      ]),
    ]);

    const totalPages = Math.ceil(total / Number(limit));

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          total,
          totalPages,
          currentPage: Number(page),
          limit: Number(limit),
        },
        statistics: stats[0] || {
          totalOrders: 0,
          totalRevenue: 0,
          pendingOrders: 0,
          completedOrders: 0,
          averageOrderValue: 0,
        },
      },
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders.",
    });
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/admin/orders/:id/status
// @access  Private (Admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, notes } = req.body;

    const validStatuses = ["processing", "shipped", "delivered", "cancelled"];
    if (!orderStatus || !validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Valid order status is required: ${validStatuses.join(", ")}`,
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus,
        $push: {
          statusHistory: {
            status: orderStatus,
            changedAt: new Date(),
            changedBy: req.admin.email,
            notes: notes || "",
          },
        },
      },
      { new: true },
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // TODO: Send status update email to customer

    res.status(200).json({
      success: true,
      message: `Order status updated to ${orderStatus}.`,
      data: order,
    });
  } catch (error) {
    console.error("Update order status error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update order status.",
    });
  }
};

// @desc    Update payment status (Admin only)
// @route   PUT /api/admin/orders/:id/payment-status
// @access  Private (Admin only)
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    const validStatuses = ["pending", "completed", "failed", "refunded"];
    if (!paymentStatus || !validStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: `Valid payment status is required: ${validStatuses.join(", ")}`,
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { paymentStatus },
      { new: true },
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: `Payment status updated to ${paymentStatus}.`,
      data: order,
    });
  } catch (error) {
    console.error("Update payment status error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update payment status.",
    });
  }
};

// @desc    Get order statistics (Admin only)
// @route   GET /api/admin/orders/statistics
// @access  Private (Admin only)
export const getOrderStatistics = async (req, res) => {
  try {
    const { period = "month" } = req.query; // day, week, month, year

    const now = new Date();
    let startDate;

    switch (period) {
      case "day":
        startDate = new Date(now.setDate(now.getDate() - 1));
        break;
      case "week":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "month":
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case "year":
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    // Get overall statistics
    const overallStats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
          averageOrderValue: { $avg: "$totalAmount" },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ["$orderStatus", "processing"] }, 1, 0] },
          },
          shippedOrders: {
            $sum: { $cond: [{ $eq: ["$orderStatus", "shipped"] }, 1, 0] },
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ["$orderStatus", "delivered"] }, 1, 0] },
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ["$orderStatus", "cancelled"] }, 1, 0] },
          },
        },
      },
    ]);

    // Get recent period statistics
    const recentStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          ordersCount: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
          dailyAverage: { $avg: "$totalAmount" },
        },
      },
    ]);

    // Get orders by payment method
    const paymentMethodStats = await Order.aggregate([
      {
        $group: {
          _id: "$paymentMethod",
          count: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Get recent orders for dashboard
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select(
        "orderNumber customerName totalAmount orderStatus paymentStatus createdAt",
      )
      .lean();

    // Get top selling products
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          productTitle: { $first: "$items.title" },
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: overallStats[0] || {
          totalOrders: 0,
          totalRevenue: 0,
          averageOrderValue: 0,
          pendingOrders: 0,
          shippedOrders: 0,
          deliveredOrders: 0,
          cancelledOrders: 0,
        },
        recentPeriod: recentStats[0] || {
          ordersCount: 0,
          revenue: 0,
          dailyAverage: 0,
        },
        paymentMethods: paymentMethodStats,
        recentOrders,
        topProducts,
      },
    });
  } catch (error) {
    console.error("Get order statistics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order statistics.",
    });
  }
};

// @desc    Get order by ID (Admin only)
// @route   GET /api/admin/orders/:id
// @access  Private (Admin only)
export const getAdminOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "items.productId",
      "title images category",
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get admin order by ID error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch order.",
    });
  }
};

// @desc    Export orders (Admin only)
// @route   GET /api/admin/orders/export
// @access  Private (Admin only)
export const exportOrders = async (req, res) => {
  try {
    const { format = "json", startDate, endDate } = req.query;

    const filter = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();

    if (format === "csv") {
      // Convert to CSV
      const csvData = convertToCSV(orders);
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=orders.csv");
      return res.send(csvData);
    }

    // Default to JSON
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Export orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export orders.",
    });
  }
};

// Helper: Convert orders to CSV
const convertToCSV = (orders) => {
  const headers = [
    "Order Number",
    "Customer Name",
    "Customer Email",
    "Total Amount",
    "Status",
    "Payment Method",
    "Payment Status",
    "Date",
  ];

  let csv = headers.join(",") + "\n";

  orders.forEach((order) => {
    const row = [
      `"${order.orderNumber}"`,
      `"${order.customerName}"`,
      `"${order.customerEmail}"`,
      order.totalAmount,
      `"${order.orderStatus}"`,
      `"${order.paymentMethod}"`,
      `"${order.paymentStatus}"`,
      `"${new Date(order.createdAt).toISOString().split("T")[0]}"`,
    ];
    csv += row.join(",") + "\n";
  });

  return csv;
};
