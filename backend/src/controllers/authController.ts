import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";

const JWT_SECRET = process.env.JWT_SECRET || "votesphere-dev-secret";

function createToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
  const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = typeof req.body.password === "string" ? req.body.password : "";

  if (!name || name.length < 2 || name.length > 100) {
    res.status(400).json({ message: "Name must be between 2 and 100 characters." });
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ message: "Please provide a valid email address." });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ message: "Password must be at least 6 characters long." });
    return;
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(409).json({ message: "An account with this email already exists." });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  res.status(201).json({
    message: "User registered successfully.",
    token: createToken(String(user._id)),
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = typeof req.body.password === "string" ? req.body.password : "";

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required." });
    return;
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401).json({ message: "Invalid email or password." });
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(401).json({ message: "Invalid email or password." });
    return;
  }

  res.json({
    message: "Login successful.",
    token: createToken(String(user._id)),
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
});
