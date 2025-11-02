import { Request, Response, NextFunction } from "express";
import { userModel } from "../models/userModel";
import { hashPassword, comparePassword } from "../utils/password";
import { generateToken } from "../utils/jwt";

export const authController = {
  // Register new user
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, password } = req.body;

      // Check if user exists
      const existingUser = userModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      // Hash password
      const passwordHash = await hashPassword(password);

      // Create user
      const user = userModel.create(email, name, passwordHash);

      // Generate token
      const token = generateToken({ userId: user.id, email: user.email });

      // Remove password from response
      const userResponse = userModel.toResponse(user);

      res.status(201).json({ user: userResponse, token });
    } catch (error) {
      next(error);
    }
  },

  // Login user
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = userModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Check password
      const isValid = await comparePassword(password, user.password_hash);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate token
      const token = generateToken({ userId: user.id, email: user.email });

      // Remove password from response
      const userResponse = userModel.toResponse(user);

      res.json({ user: userResponse, token });
    } catch (error) {
      next(error);
    }
  },

  // Get current user
  me: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const user = userModel.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const userResponse = userModel.toResponse(user);
      res.json({ user: userResponse });
    } catch (error) {
      next(error);
    }
  },
};
