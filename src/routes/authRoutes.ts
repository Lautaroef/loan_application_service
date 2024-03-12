import express from 'express';
import type { Request, Response } from 'express';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../database/models/User';
import { Role } from '../database/models';

import { body, validationResult } from 'express-validator';

const router = express.Router();
const secret = (process.env.JWT_SECRET as string) || 'secret';

router.post(
  '/auth/register',
  [
    body('username').isString().trim().notEmpty(),
    body('password').isLength({ min: 6 }),
    body('role').optional().isIn(['admin', 'applicant'])
  ],
  async (req: Request, res: Response) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      // Find default role and create user
      const defaultRole = await Role.findOne({ where: { name: 'applicant' } });

      const user = await User.create({
        username,
        password: hashedPassword,
        roleId: defaultRole?.id
      });
      res.status(201).json({ message: 'User registered successfully', userId: user.id });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

router.post(
  '/auth/login',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req: Request, res: Response) => {
    // Validate body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    // Find user and check password
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Get user role
    const role = await Role.findByPk(user.roleId);
    if (!role) {
      return res.status(500).json({ message: 'Role not found' });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id, role: role.name }, secret, {
      expiresIn: '1h'
    });
    res.json({ message: 'Login successful', token });
  }
);
export default router;
