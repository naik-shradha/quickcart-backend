const Order = require("../models/orderModel");
const Cart = require("../models/Cart");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Create a new order from user's cart
const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const cart = await Cart.findOne({ userId }).populate("items.productId");

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error("Cart is empty");
  }

  const totalPrice = cart.items.reduce(
    (acc, item) => acc + item.productId.price * item.quantity,
    0
  );

  const order = await Order.create({
    userId,
    items: cart.items.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
    })),
    totalPrice,
  });

  await Cart.findOneAndDelete({ userId }); // clear cart after order

  res.status(201).json(order);
});

// @desc    Get all orders for a specific user
const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user.userId }).populate(
    "items.productId"
  );
  res.json(orders);
});

// @desc    Get all orders (admin)
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("userId", "name email");
  res.json(orders);
});

// @desc    Update order status (admin)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.status = status;
  await order.save();

  res.json({ message: "Status updated", order });
});

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
};
