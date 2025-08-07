# ⚙️ QuickCart Backend

This is the backend for **QuickCart**, a real-time grocery ordering platform that powers secure user authentication, product and cart management, order processing, and PayPal payments with admin capabilities.

---

## 🚀 Features

- 🔐 JWT-based user authentication (Login/Register)
- 👥 Role-based access control (Customer / Admin)
- 🛍 Product CRUD (Admin only)
- 🛒 Cart management with MongoDB persistence
- 📦 Order creation from cart and order history
- 🔁 Real-time cart updates using WebSockets
- 💳 PayPal payment integration via server SDK
- 🧑‍💼 Admin: view all orders & update order status
- 📡 Robust API with error handling and protection middleware

---

## ⚙️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** for authentication
- **Socket.io** (real-time cart updates)
- **@paypal/checkout-server-sdk** (PayPal integration)
- **dotenv** (environment variables)
- **Render / Railway** for deployment

---
