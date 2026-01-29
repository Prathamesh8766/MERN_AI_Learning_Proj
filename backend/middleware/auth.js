import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
     console.log("Received Token:", token);
    token = req.headers.authorization.split(" ")[1];
    console.log("Received Token:", token);
    

    try {
    
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Get user
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User no longer exists",
        });
      }

      // 4. Attach user
      req.user = user;
      return next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token has expired",
        });
      }

      return res.status(401).json({
        success: false,
        message: "Not authorized, token invalid",
      });
    }
  }

  // 5. No token provided
  return res.status(401).json({
    success: false,
    message: "Not authorized, no token provided",
  });
};

export default protect;
