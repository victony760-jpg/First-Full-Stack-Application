import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Helper function to generate a JWT token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret_key", {
    expiresIn: "7d",
  });
};

// ==========================================
// 1. ROUTE FOR USER REGISTRATION
// ==========================================
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all required fields" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const exists = await userModel.findOne({ email });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);

    return res
      .status(201)
      .json({ success: true, token, message: "User registered successfully" });
  } catch (error) {
    console.error("Registration Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error registering user" });
  }
};

// ==========================================
// 2. ROUTE FOR USER LOGIN
// ==========================================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all required fields" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(401) // 401 Unauthorized for invalid credentials
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401) // 401 Unauthorized
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user._id);

    return res
      .status(200)
      .json({ success: true, token, message: "Login successful" });
  } catch (error) {
    console.error("Login Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error logging in user" });
  }
};

// ==========================================
// 3. ROUTE FOR ADMIN LOGIN (SECURED)
// ==========================================
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Direct match against your .env variables
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // FIX: Secure payload with "role" and an expiration date
      const token = jwt.sign(
        { email, role: "admin" },
        process.env.JWT_SECRET || "fallback_secret_key",
        { expiresIn: "1d" }, // Token expires in 1 day instead of lasting forever
      );

      return res
        .status(200)
        .json({ success: true, token, message: "Admin login successful" });
    } else {
      return res
        .status(401) // 401 Unauthorized
        .json({ success: false, message: "Invalid admin credentials" });
    }
  } catch (error) {
    console.error("Admin Login Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error logging in admin" });
  }
};

export { loginUser, registerUser, adminLogin };
