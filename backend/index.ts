import dotenv from "dotenv";
dotenv.config(); // Load environment variables first

import express, { Express, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

// Route Imports
import authRoutes from "./src/routes/auth.routes";
import userRoutes from "./src/routes/user.routes";
import roleRoutes from "./src/routes/role.routes";
import vendorRoutes from "./src/routes/vendor.routes";
import categoryRoutes from "./src/routes/category.routes";
import sizeRoutes from "./src/routes/size.routes";
import productRoutes from "./src/routes/product.routes";
import inventoryRoutes from "./src/routes/inventory.route";
import saleRoutes from "./src/routes/sale.routes";
import dashboardRoutes from "./src/routes/dashbord.routes";

// Initialize Express App
const app: Express = express();
const PORT = process.env.PORT || 5022;

// Core Middlewares
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5022", "http://localhost:5000"],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/sizes", sizeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Global Error Handler:", err); // Log the error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong on the server!",
  });
});

// Server Startup
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ Successfully connected to MongoDB.");
    app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error);
    process.exit(1);
  }
};

startServer();