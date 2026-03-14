import { Request, Response } from "express";
import * as VendorService from "../services/vendor.service.ts";

export const createVendor = async (req: Request, res: Response) => {
  try {
    const vendor = await VendorService.createVendor(req.body);
    res.status(201).json({ success: true, data: vendor });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getVendors = async (req: Request, res: Response) => {
  try {
    const vendors = await VendorService.getAllVendors();
    res.status(200).json({ success: true, data: vendors });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVendor = async (req: Request, res: Response) => {
  try {
    const vendor = await VendorService.getVendorById(req.params.id);
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });
    res.status(200).json({ success: true, data: vendor });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateVendor = async (req: Request, res: Response) => {
  try {
    const vendor = await VendorService.updateVendor(req.params.id, req.body);
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });
    res.status(200).json({ success: true, data: vendor });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteVendor = async (req: Request, res: Response) => {
  try {
    const vendor = await VendorService.deleteVendor(req.params.id);
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });
    res.status(200).json({ success: true, message: "Vendor deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};