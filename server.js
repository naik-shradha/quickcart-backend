// server.js
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

// Setup WebSocket server
const io = new Server(server, {
cors: {
origin: "http://localhost:3000", // your React frontend
methods: ["GET", "POST", "DELETE"],
},
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

// Middleware
app.use(cors());
app.use(express.json());

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

