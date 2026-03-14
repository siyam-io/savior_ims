import { Request, Response } from "express";
import * as SizeService from "../services/size.service";

export const createSize = async (req: Request, res: Response) => {
  try {
    const size = await SizeService.createSize(req.body);
    res.status(201).json({ success: true, data: size });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getSizes = async (req: Request, res: Response) => {
  try {
    const sizes = await SizeService.getSizes();
    res.status(200).json({ success: true, data: sizes });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSize = async (req: Request, res: Response) => {
  try {
    const size = await SizeService.getSizeById(req.params.id);
    if (!size) return res.status(404).json({ success: false, message: "Size not found" });
    res.status(200).json({ success: true, data: size });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSize = async (req: Request, res: Response) => {
  try {
    const size = await SizeService.updateSize(req.params.id, req.body);
    if (!size) return res.status(404).json({ success: false, message: "Size not found" });
    res.status(200).json({ success: true, data: size });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteSize = async (req: Request, res: Response) => {
  try {
    const size = await SizeService.deleteSize(req.params.id);
    if (!size) return res.status(404).json({ success: false, message: "Size not found" });
    res.status(200).json({ success: true, message: "Size deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};