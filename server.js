const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const errorHandler = require("./middleware/errorHandler");

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = require("./config/db");
connectDB();

// Initialize Express app
const app = express();

// Create HTTP server to enable WebSocket (socket.io)
const server = http.createServer(app);

// Setup dynamic CORS options
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

// Apply CORS middleware for Express
app.use(cors(corsOptions));
app.use(express.json());

// Setup WebSocket server with CORS
const io = new Server(server, {
  cors: corsOptions,
});

// WebSocket logic
io.on("connection", (socket) => {
  console.log("🟢 WebSocket connected:", socket.id);

  socket.on("addToCart", (data) => {
    console.log("🛒 Item added to cart via socket:", data);
    socket.broadcast.emit("cartUpdated", data); // notify other clients
  });

  socket.on("disconnect", () => {
    console.log("🔴 WebSocket disconnected:", socket.id);
  });
});

// API Routes
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes")); // ✅ NEW
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
