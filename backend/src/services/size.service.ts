import { Size, ISize } from "../models/Size";

/**
 * Create a new universal size
 */
export const createSize = async (data: Partial<ISize>) => {
  return await Size.create(data);
};

/**
 * Get all universal sizes
 * Sorted alphabetically by label (e.g., L, M, S, XL)
 */
export const getSizes = async () => {
  // Removed .populate("category") as it's no longer needed for universal sizes
  return await Size.find().sort({ label: 1 });
};

/**
 * Get a single size by ID
 */
export const getSizeById = async (id: string) => {
  return await Size.findById(id);
};

/**
 * Update size details
 */
export const updateSize = async (id: string, data: Partial<ISize>) => {
  return await Size.findByIdAndUpdate(id, data, { new: true });
};

/**
 * Delete a size
 */
export const deleteSize = async (id: string) => {
  return await Size.findByIdAndDelete(id);
};

// NOTE: getSizesByCategory is removed as sizes are now universal.