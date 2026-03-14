import { Role, IRole } from "../models/Role.ts";

export const createRole = async (data: Partial<IRole>) => {
  return await Role.create(data);
};

export const getRoles = async () => {
  return await Role.find().sort({ name: 1 });
};

export const getRoleById = async (id: string) => {
  return await Role.findById(id);
};

export const updateRole = async (id: string, data: Partial<IRole>) => {
  return await Role.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const deleteRole = async (id: string) => {
  return await Role.findByIdAndDelete(id);
};