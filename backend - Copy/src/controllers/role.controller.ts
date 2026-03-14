import { Request, Response } from "express";
import * as RoleService from "../services/role.service";

export const createRole = async (req: Request, res: Response) => {
  try {
    const role = await RoleService.createRole(req.body);
    res.status(201).json({ success: true, data: role });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await RoleService.getRoles();
    res.status(200).json({ success: true, data: roles });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRole = async (req: Request, res: Response) => {
  try {
    const role = await RoleService.getRoleById(req.params.id);
    if (!role) return res.status(404).json({ success: false, message: "Role not found" });
    res.status(200).json({ success: true, data: role });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateRole = async (req: Request, res: Response) => {
  try {
    const role = await RoleService.updateRole(req.params.id, req.body);
    if (!role) return res.status(404).json({ success: false, message: "Role not found" });
    res.status(200).json({ success: true, data: role });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  try {
    const role = await RoleService.deleteRole(req.params.id);
    if (!role) return res.status(404).json({ success: false, message: "Role not found" });
    res.status(200).json({ success: true, message: "Role deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};