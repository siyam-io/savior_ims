import type { Request, Response } from 'express';
import Outlet from './model.js';
import type { OutletInput } from './schema.js';

export const createOutlet = async (req: Request<{}, {}, OutletInput>, res: Response): Promise<void> => {
  try {
    const outlet = new Outlet(req.body);
    await outlet.save();
    res.status(201).json(outlet);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getOutlets = async (req: Request, res: Response): Promise<void> => {
  try {
    const outlets = await Outlet.find();
    res.json(outlets);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getOutletById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const outlet = await Outlet.findById(req.params.id);
    if (!outlet) {
      res.status(404).json({ error: 'Outlet not found' });
      return;
    }
    res.json(outlet);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateOutlet = async (req: Request<{ id: string }, {}, OutletInput>, res: Response): Promise<void> => {
  try {
    const outlet = await Outlet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(outlet);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteOutlet = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    await Outlet.findByIdAndDelete(req.params.id);
    res.json({ message: 'Outlet deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
