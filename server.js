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

// Allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://quickcart-frontend-b2as2b9wx-naik-shradhas-projects.vercel.app" // ✅ Your Vercel frontend
];

// CORS middleware for REST APIs
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// WebSocket Server (Socket.IO) with CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "DELETE"],
    credentials: true
  }
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

// Attach io to app so routes can access it (optional)
app.set("io", io);

// API Routes
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
