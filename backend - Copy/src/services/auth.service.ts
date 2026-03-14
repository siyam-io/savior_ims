import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User";

// Helper: Token Generator
export const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

export const registerUser = async (data: Partial<IUser>) => {
  // Check if user already exists
  const userExists = await User.findOne({ email: data.email });
  if (userExists) {
    throw new Error("User already exists with this email");
  }

  // Hash password before saving
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password as string, salt);

  const user = await User.create({
    ...data,
    password: hashedPassword,
  });

  return user;
};

export const loginUser = async (email: string, password: string) => {
  // Find user and populate role to send to frontend
  const user = await User.findOne({ email }).populate("role", "name permissions");
  if (!user) {
    throw new Error("Invalid credentials");
  }

  // Check if inactive
  if (user.status === "inactive") {
    throw new Error("Account has been deactivated");
  }

  // Match password
  const isMatch = await bcrypt.compare(password, user.password as string);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  return user;
};