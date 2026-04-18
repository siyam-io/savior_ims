import type { Request, Response } from 'express';
import User from './model.js';
import bcrypt from 'bcryptjs';
import type { CreateEmployeeInput, UpdateEmployeeInput } from './schema.js';
import type { AuthRequest } from '../../types/index.js';

export const createEmployee = async (req: Request<{}, {}, CreateEmployeeInput>, res: Response): Promise<void> => {
  try {
    const { email, password, name, profileImage, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ 
      email, 
      password: hashed, 
      name: name || '',
      profileImage: profileImage || '',
      role: role || 'employee'
    });
    await user.save();
    res.status(201).json({ message: 'Employee created', userId: user._id });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getEmployees = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getEmployeeById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateEmployee = async (req: Request<{ id: string }, {}, UpdateEmployeeInput>, res: Response): Promise<void> => {
  try {
    const { email, role, name, profileImage } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { email, role, name, profileImage },
      { new: true }
    );
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { name, profileImage, currentPassword, newPassword } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (name !== undefined) user.name = name;
    if (profileImage !== undefined) user.profileImage = profileImage;

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(401).json({ error: 'Current password is incorrect' });
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();
    res.json({ 
      message: 'Profile updated', 
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name, 
        profileImage: user.profileImage, 
        role: user.role 
      } 
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteEmployee = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
