import bcrypt from "bcryptjs";
import { User, IUser } from "../models/User";

export const createUser = async (data: Partial<IUser>) => {
  // ইমেইল অলরেডি আছে কিনা চেক
  const userExists = await User.findOne({ email: data.email });
  if (userExists) {
    throw new Error("User already exists with this email");
  }

  // পাসওয়ার্ড হ্যাশ করা (অ্যাডমিন যে পাসওয়ার্ড দিবে সেটা)
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password as string, salt);

  const user = await User.create({
    ...data,
    password: hashedPassword,
  });

  return user;
};

export const getAllUsers = async (filters: any = {}) => {
  return await User.find(filters)
    .populate("role", "name")
    .populate("vendors", "name") 
    .select("-password");
};

export const getUserById = async (id: string) => {
  return await User.findById(id)
    .populate("role", "name permissions")
    .populate("vendors", "name")
    .select("-password");
};

export const updateUser = async (id: string, data: Partial<IUser>) => {
  if (data.password) {
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password as string, salt);
  }
  return await User.findByIdAndUpdate(id, data, { new: true }).select("-password");
};

export const deleteUser = async (id: string) => {
  return await User.findByIdAndDelete(id);
};