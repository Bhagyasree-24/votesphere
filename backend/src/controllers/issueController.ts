import { Request, Response } from "express";
import Issue from "../models/Issue";
import { asyncHandler } from "../utils/asyncHandler";

export const getIssues = asyncHandler(async (_req: Request, res: Response) => {
  const issues = await Issue.find().sort({ createdAt: -1 }).lean();
  res.json(issues);
});

export const createIssue = asyncHandler(async (req: Request, res: Response) => {
  const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
  const description = typeof req.body.description === "string" ? req.body.description.trim() : "";
  const category = typeof req.body.category === "string" ? req.body.category.trim() : "";

  if (!title || title.length > 120) {
    res.status(400).json({ message: "Issue title is required and must be under 120 characters." });
    return;
  }

  if (!description || description.length > 800) {
    res.status(400).json({ message: "Description is required and must be under 800 characters." });
    return;
  }

  if (!category || category.length > 60) {
    res.status(400).json({ message: "Category is required and must be under 60 characters." });
    return;
  }

  const issue = await Issue.create({ title, description, category, status: "Open" });
  res.status(201).json(issue);
});
