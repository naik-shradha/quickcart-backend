const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
} = require("../controllers/orderController");

const {
  createPayment,
  capturePayment,
} = require("../controllers/paypalController");

const { protect, customerOnly } = require("../middleware/authMiddleware");

// 🛒 Order Routes
router.post("/create", protect, customerOnly, createOrder);
router.get("/my-orders", protect, customerOnly, getUserOrders);

// 💳 PayPal Payment Routes
router.post("/create-paypal-order", protect, customerOnly, createPayment);
router.post("/capture-paypal-order", protect, customerOnly, capturePayment);

// new updations
const {
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { adminOnly } = require("../middleware/authMiddleware");

// Admin: View all orders
router.get("/all", protect, adminOnly, getAllOrders);

// Admin: Update order status
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

module.exports = router;
