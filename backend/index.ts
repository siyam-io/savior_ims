import dotenv from "dotenv";
dotenv.config();

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

const app: Express = express();
const PORT = process.env.PORT || 5022;

// --- Production CORS Strategy ---
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5022",
  "http://localhost:5000",
  "https://saviorimsweb.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
}));

app.use(express.json());
app.use(cookieParser());

// --- Database Connection (Optimized for Serverless) ---
const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  
  try {
    if (!MONGO_URI) throw new Error("MONGO_URI is missing from Env Variables");
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ DB Connection Error:", error);
  }
};

// --- Middleware to ensure DB is connected before processing requests ---
app.use(async (req: Request, res: Response, next: NextFunction) => {
  await connectDB();
  next();
});

// --- API Routes ---
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

// --- Health Check ---
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: "active",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// --- Global Error Handler ---
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Server Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
}

export default app;