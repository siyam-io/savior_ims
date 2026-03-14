import { Request, Response } from "express";
import * as UserService from "../services/user.service";

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await UserService.createUser(req.body);
    user.password = undefined; // রেসপন্স থেকে পাসওয়ার্ড সরানো

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    let filters: any = {};
    // ভেন্ডর অ্যাডমিন হলে সে শুধু তার এসাইন করা ভেন্ডরদের ডাটা দেখবে
    if (req.user.role.name === "vendor-admin") {
      filters.vendors = { $in: req.user.vendors };
    }
    const users = await UserService.getAllUsers(filters);
    res.status(200).json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await UserService.updateUser(req.params.id, req.body);
    res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await UserService.deleteUser(req.params.id);
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};