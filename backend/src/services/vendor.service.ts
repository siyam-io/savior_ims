import { Vendor, IVendor } from "../models/Vendor";

export const createVendor = async (data: Partial<IVendor>) => {
  return await Vendor.create(data);
};

export const getAllVendors = async () => {
  return await Vendor.find().sort({ createdAt: -1 });
};

export const getVendorById = async (id: string) => {
  return await Vendor.findById(id);
};

export const updateVendor = async (id: string, data: Partial<IVendor>) => {
  return await Vendor.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const deleteVendor = async (id: string) => {
  return await Vendor.findByIdAndDelete(id);
};