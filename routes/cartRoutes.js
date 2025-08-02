// routes/cartRoutes.js
const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCart,
  clearCart,
  removeCartItem, // ✅ corrected name here
  updateCartItem,
} = require("../controllers/cartController");

const { protect, customerOnly } = require("../middleware/authMiddleware");

router.get("/", protect, customerOnly, getCart);
router.post("/add", protect, customerOnly, addToCart);
router.delete("/remove/:productId", protect, customerOnly, removeCartItem); // ✅ corrected
router.patch("/update/:productId", protect, customerOnly, updateCartItem);
router.delete("/clear", protect, customerOnly, clearCart);
// router.put("/update", protect, customerOnly, updateCartItem);
// router.get("/", protect, customerOnly, getCart);


module.exports = router;
