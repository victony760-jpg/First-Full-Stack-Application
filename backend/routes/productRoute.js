import express from "express";
import upload from "../middleware/multer.js";
import {
  listProduct,
  addProduct,
  removeProduct,
  singleProduct,
} from "../controllers/productController.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

// PUBLIC routes - added /list for frontend
productRouter.get("/list", listProduct); // <-- NEW: for frontend
productRouter.get("/", listProduct); // <-- KEEP: backup
productRouter.post("/single", singleProduct);

// ADMIN routes
productRouter.post(
  "/add",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct,
);

productRouter.post("/remove", adminAuth, removeProduct);

export default productRouter;
