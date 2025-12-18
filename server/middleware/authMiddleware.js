import jwt from "jsonwebtoken";
import User from "../model/User.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
    // req.headers.authorization.startsWith("Bearer ")
    //   ? req.headers.authorization.slice(7)
    //   : null;

    if (!token)
      return res.status(401).json({ message: "Authentication required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middlware error:", error);
    res.status(401).json({ message: "Unauthorized or invalid token" });
  }
};

export const authorizeRoles = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return res
        .status(403)
        .json({ message: "Access denied: insufficient permissions" });
    next();
  };
};
