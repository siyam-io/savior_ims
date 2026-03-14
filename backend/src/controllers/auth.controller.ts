import { Request, Response } from "express";
import * as AuthService from "../services/auth.service";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, 
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // AuthService এখন ইউজারকে তার Role এবং Vendors সহ রিটার্ন করবে
    const user = await AuthService.loginUser(email, password);
    const token = AuthService.generateToken(user._id as string);

    user.password = undefined; 

    res.status(200).cookie("token", token, cookieOptions).json({
      success: true,
      data: user
    });
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    // req.user অলরেডি মিডলওয়্যার থেকে পপুলেট হয়ে আসবে
    res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = (req: Request, res: Response) => {

  res.cookie("token", "none", {

    expires: new Date(Date.now() + 5 * 1000),

    httpOnly: true,

  });

  res.status(200).json({ success: true, message: "Logged out successfully" });

};



export const updateMe = async (req: Request, res: Response) => {

  try {

    const user = await AuthService.updateMe(req.user._id, req.body);

    user.password = undefined;

    res.status(200).json({

      success: true,

      data: user,

    });

  } catch (error: any) {

    res.status(400).json({ success: false, message: error.message });

  }

};
