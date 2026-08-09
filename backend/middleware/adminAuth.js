import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const tokenHeader = req.headers.token;

    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : tokenHeader;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || decoded.role !== "admin") {
      return res
        .status(403)
        .json({
          success: false,
          message: "Forbidden: Admin privileges required.",
        });
    }

    req.user = decoded;
    req.adminId = decoded.id;
    req.userId = decoded.id;
    req.isAdmin = true; // Critical for delete
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired" });
    }
    return res.status(401).json({ success: false, message: "Invalid token." });
  }
};

export default adminAuth;
