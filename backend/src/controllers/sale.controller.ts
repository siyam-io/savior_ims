import { Request, Response } from "express";
import * as SaleService from "../services/sale.service";

export const handleCreateSale = async (req: Request, res: Response) => {
  try {
    const { vendor } = req.body;
    const { role, vendors, _id: userId } = req.user;

    if (role.name !== "super-admin" && !vendors.includes(vendor)) {
      return res.status(403).json({ success: false, message: "Unauthorized vendor access" });
    }

    const sale = await SaleService.createSaleTransaction(req.body, userId);
    res.status(201).json({ success: true, data: sale });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const handleGetSales = async (req: Request, res: Response) => {
  try {
    let filters: any = {};
    if (req.user.role.name !== "super-admin") {
      filters.vendor = { $in: req.user.vendors };
    }

    const sales = await SaleService.getSalesHistory(filters);
    res.status(200).json({ success: true, data: sales });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};