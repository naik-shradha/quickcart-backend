const Cart = require("../models/Cart");
const asyncHandler = require("../middleware/asyncHandler");

// @desc Add item to cart
const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { productId, quantity } = req.body;
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  const existingItem = cart.items.find(
    (item) => item.productId.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity || 1;
  } else {
    cart.items.push({ productId, quantity: quantity || 1 });
  }

  await cart.save();
  res.status(200).json({ message: "Added to cart", cart });
});

// @desc Get user's cart
const getCart = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const cart = await Cart.findOne({ userId }).populate("items.productId");
  if (!cart) return res.status(200).json({ items: [] });
  res.status(200).json(cart);
});

// @desc Remove a single item from cart
const removeCartItem = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { productId } = req.params;
  const cart = await Cart.findOne({ userId });

  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId
  );

  await cart.save();
  res.status(200).json({ message: "Item removed", cart });
});

// @desc Update quantity of cart item
const updateCartItem = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { productId } = req.params;
  const { quantity } = req.body;
  const cart = await Cart.findOne({ userId });

  if (!cart) return res.status(404).json({ message: "Cart not found" });

  const item = cart.items.find(
    (item) => item.productId.toString() === productId
  );

  if (!item) return res.status(404).json({ message: "Item not found" });

  item.quantity = quantity;
  await cart.save();
  res.status(200).json({ message: "Quantity updated", cart });
});

// @desc Clear cart
const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  await Cart.findOneAndDelete({ userId });
  res.status(200).json({ message: "Cart cleared" });
});

module.exports = {
  addToCart,
  getCart,
  clearCart,
  updateCartItem,
  removeCartItem,
};
