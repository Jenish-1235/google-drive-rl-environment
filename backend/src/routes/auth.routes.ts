import { Router } from "express";
import { body } from "express-validator";
import { authController } from "../controllers/authController";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";

const router = Router();

// POST /api/auth/register
router.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("name").notEmpty().trim(),
    body("password").isLength({ min: 6 }),
    validate,
  ],
  authController.register
);

// POST /api/auth/login
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").notEmpty(),
    validate,
  ],
  authController.login
);

// GET /api/auth/me
router.get("/me", authenticate, authController.me);

export default router;
