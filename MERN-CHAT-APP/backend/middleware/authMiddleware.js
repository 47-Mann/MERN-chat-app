import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

const protect = async (req, res, next) => {
  let token;

  // Protected requests must provide a JWT in the standard Bearer format.
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Remove the "Bearer " prefix and verify the token signature and expiry.
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the authenticated user so protected routes can use req.user.
      req.user = await User.findById(decoded.id).select("-password");
      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

const requireAdmin = async (req, res, next) => {
  try {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "Not authorized, Admin only" });
    }
  } catch (error) {
    res.status(401).json({ message: error });
  }
};

export { protect, requireAdmin };
export default { protect, requireAdmin };
