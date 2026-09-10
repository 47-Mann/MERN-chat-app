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
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
export default protect;
