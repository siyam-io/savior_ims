import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../user/model.js';
import type { LoginInput, RegisterInput } from './schema.js';

export const register = async (req: Request<{}, {}, RegisterInput>, res: Response): Promise<void> => {
  try {
    const { email, password, role, assignedOutlets } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed, role, assignedOutlets });
    await user.save();
    res.status(201).json({ message: 'User created', userId: user._id });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req: Request<{}, {}, LoginInput>, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate('assignedOutlets');
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        assignedOutlets: user.assignedOutlets,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
