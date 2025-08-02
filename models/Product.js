const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    image: { type: String }, // optional
  },
  { timestamps: true }
);

productSchema.index({ name: 1 });

module.exports = mongoose.model("Product", productSchema);
