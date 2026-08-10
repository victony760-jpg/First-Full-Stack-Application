import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// app config
const app = express();
const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();

// CORS - Allow Admin + Frontend + Local Dev
const allowedOrigins = [
  "https://victony-wears-admin.vercel.app", // ADMIN
  "https://first-full-stack-application-rho.vercel.app", // FRONTEND
  "http://localhost:5173", // Vite local
  "http://localhost:3000", // React local
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token"],
  }),
);

app.use(express.json());

// api endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// health check
app.get("/", (req, res) => {
  res.send("Victony Wears API is running");
});

// listen
app.listen(port, () => console.log(`Server running on port ${port}`));
