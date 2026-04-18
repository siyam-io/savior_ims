import type { Request, Response } from 'express';
import Courier from './model.js';
import type { CourierInput } from './schema.js';

export const createCourier = async (req: Request<{}, {}, CourierInput>, res: Response) => {
  try {
    const courier = new Courier(req.body);
    await courier.save();
    res.status(201).json(courier);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getCouriers = async (req: Request, res: Response) => {
  try {
    const couriers = await Courier.find();
    res.json(couriers);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getCourierById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const courier = await Courier.findById(req.params.id);
    if (!courier) return res.status(404).json({ error: 'Courier not found' });
    res.json(courier);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCourier = async (req: Request<{ id: string }, {}, Partial<CourierInput>>, res: Response) => {
  try {
    const courier = await Courier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(courier);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteCourier = async (req: Request<{ id: string }>, res: Response) => {
  try {
    await Courier.findByIdAndDelete(req.params.id);
    res.json({ message: 'Courier deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
