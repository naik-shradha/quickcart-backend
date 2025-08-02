const Product = require("../models/Product");
const asyncHandler = require("../middleware/asyncHandler");

// ✅ Add new product (Admin only)
const addProduct = asyncHandler(async (req, res) => {
  const { name, price, stock, image } = req.body;

  const product = new Product({ name, price, stock, image });
  await product.save();

  res.status(201).json({ message: "Product added", product });
});

// ✅ Get all products (Public)
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res.status(200).json(products);
});

// ✅ Update product (Admin only)
const updateProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const { name, price, stock, image } = req.body;

  const product = await Product.findByIdAndUpdate(
    productId,
    { name, price, stock, image },
    { new: true }
  );

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json({ message: "Product updated", product });
});

// ✅ Delete product (Admin only)
const deleteProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;

  const product = await Product.findByIdAndDelete(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json({ message: "Product deleted" });
});

module.exports = {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
