import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import productModel from "../models/productModel.js";

// ==========================================
// 1. ADD NEW PRODUCT (WITH STOCK)
// ==========================================
const addProduct = async (req, res) => {
  try {
    // Added "stock" to the destructured body fields
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
      bestSeller,
      stock,
    } = req.body;

    // Gather uploaded image files from req.files safely
    const image1 = req.files && req.files.image1 && req.files.image1[0];
    const image2 = req.files && req.files.image2 && req.files.image2[0];
    const image3 = req.files && req.files.image3 && req.files.image3[0];
    const image4 = req.files && req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined,
    );

    // Upload gathered images to Cloudinary, remove local files after upload
    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        try {
          const result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
          });
          return result && result.secure_url ? result.secure_url : item.path;
        } finally {
          // best-effort cleanup of the temp upload file
          try {
            if (item && item.path && fs.existsSync(item.path))
              fs.unlinkSync(item.path);
          } catch (e) {
            console.warn("Failed to remove temp upload:", e.message);
          }
        }
      }),
    );

    // Normalize bestseller (accept both `bestseller` and `bestSeller`) and parse sizes
    const normalizedBestseller =
      bestseller === "true" ||
      bestseller === true ||
      bestSeller === "true" ||
      bestSeller === true;

    let parsedSizes = [];
    if (Array.isArray(sizes)) parsedSizes = sizes;
    else if (typeof sizes === "string") {
      const trimmed = sizes.trim();
      // If it's a JSON array string like "[\"S\",\"M\"]"
      if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        try {
          parsedSizes = JSON.parse(trimmed);
        } catch (e) {
          // fallback to removing brackets and splitting
          parsedSizes = trimmed
            .replace(/^[\[\]"]+|[\[\]"]+$/g, "")
            .split(",")
            .map((s) => s.replace(/^\s*"|"\s*$/g, "").trim())
            .filter(Boolean);
        }
      } else if (trimmed.includes(",")) {
        parsedSizes = trimmed
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      } else if (trimmed.length > 0) {
        parsedSizes = [trimmed];
      }
    }

    // Build out the structured product data object (including stock)
    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestseller: normalizedBestseller,
      sizes: parsedSizes,
      stock: stock ? Number(stock) : 0, // Saves stock as a Number (defaults to 0 if not sent)
      image: imagesUrl,
      date: new Date(),
    };

    // Save to Database
    const product = new productModel(productData);
    await product.save();

    return res
      .status(201)
      .json({ success: true, message: "Product added successfully" });
  } catch (error) {
    console.error("Add Product Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 2. LIST ALL PRODUCTS
// ==========================================
const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({});
    return res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("List Products Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 3. REMOVE PRODUCT
// ==========================================
const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required" });
    }

    const deletedProduct = await productModel.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    console.error("Remove Product Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 4. FETCH SINGLE PRODUCT INFO
// ==========================================
const singleProduct = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required" });
    }

    const product = await productModel.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Single Product Info Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { listProduct, addProduct, removeProduct, singleProduct };
