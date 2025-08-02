const jwt = require("jsonwebtoken");

// Middleware to protect routes (requires valid JWT token)
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if Authorization header is present and starts with "Bearer"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Extract the actual token (removing "Bearer ")
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user info (userId, role) to request object
    req.user = decoded;

    next(); // Continue to next middleware/route
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware to restrict access to admin users only
const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
};

// Middleware to restrict access to customer users only
const customerOnly = (req, res, next) => {
  if (req.user?.role !== "customer") {
    return res.status(403).json({ message: "Customers only" });
  }
  next();
};

module.exports = { protect, adminOnly, customerOnly };
