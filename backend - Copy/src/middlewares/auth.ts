import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ success: false, message: "Not authorized" });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const user = await User.findById(decoded.id).populate("role");
    
    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Session expired" });
  }
};

export const authorize = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role?.name === "super-admin") return next();

    const hasPermission = req.user?.role?.permissions?.includes(permission);
    if (!hasPermission) {
      return res.status(403).json({ 
        success: false, 
        message: `Denied: Required permission '${permission}' missing.` 
      });
    }
    next();
  };
};