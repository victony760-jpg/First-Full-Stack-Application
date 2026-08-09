import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  _id: { type: String }, // because your seed has custom _id like "aaaaa"
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: Array, required: true }, // array of Cloudinary URLs
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  sizes: { type: Array, required: true },
  bestseller: { type: Boolean, default: false },
  stock: { type: Number, required: true, default: 0 },
  date: { type: Number, required: true }, // Number because seed uses timestamps like 1716634345448
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
