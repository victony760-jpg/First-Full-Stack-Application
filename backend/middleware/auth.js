import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // <-- attach to req.userId
    next();
  } catch (error) {
    console.log("Token verification error:", error);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default authUser;
