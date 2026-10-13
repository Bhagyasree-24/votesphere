import { Request, Response } from "express";
import mongoose from "mongoose";
import Poll from "../models/Poll";
import { asyncHandler } from "../utils/asyncHandler";

export const getPolls = asyncHandler(async (_req: Request, res: Response) => {
  const polls = await Poll.find().sort({ createdAt: -1 }).lean();
  res.json(polls);
});

export const createPoll = asyncHandler(async (req: Request, res: Response) => {
  const question = typeof req.body.question === "string"
    ? req.body.question.trim()
    : "";
  const rawOptions: unknown = req.body.options;
  const category = typeof req.body.category === "string" ? req.body.category : "Campus";
  const allowedCategories = ["Campus", "Events", "Facilities", "Safety", "Wellbeing", "Other"];
  const rawClosesAt = req.body.closesAt;
  const closesAt = typeof rawClosesAt === "string" && rawClosesAt
    ? new Date(`${rawClosesAt}T23:59:59.999Z`)
    : null;

  if (
    !question ||
    question.length > 200 ||
    !allowedCategories.includes(category) ||
    (closesAt !== null && (!Number.isFinite(closesAt.getTime()) || closesAt <= new Date())) ||
    !Array.isArray(rawOptions) ||
    rawOptions.length < 2 ||
    rawOptions.length > 6 ||
    !rawOptions.every((value) =>
      typeof value === "string" &&
      value.trim().length > 0 &&
      value.trim().length <= 100
    )
  ) {
    res.status(400).json({
      message: "Enter a question (max 200 characters) and 2–6 options (1–100 characters each)."
    });
    return;
  }

  const options = (rawOptions as string[]).map((text) => ({
    text: text.trim(),
    votes: 0
  }));

  const poll = await Poll.create({ question, category, closesAt, options });
  res.status(201).json(poll);
});

export const castVote = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { optionId, voterId } = req.body as {
    optionId?: unknown;
    voterId?: unknown;
  };

  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid poll ID." });
    return;
  }
  if (
    typeof optionId !== "string" ||
    !mongoose.isValidObjectId(optionId) ||
    typeof voterId !== "string" ||
    voterId.trim().length < 8 ||
    voterId.trim().length > 100
  ) {
    res.status(400).json({
      message: "A valid optionId and voterId (8–100 characters) are required."
    });
    return;
  }

  const normalizedVoterId = voterId.trim();

  // Atomic update: only update if this voter has not voted and option belongs to poll.
  const updatedPoll = await Poll.findOneAndUpdate(
    {
      _id: id,
      "options._id": optionId,
      voters: { $ne: normalizedVoterId },
      $or: [
        { closesAt: null },
        { closesAt: { $exists: false } },
        { closesAt: { $gt: new Date() } }
      ]
    },
    {
      $inc: { "options.$.votes": 1 },
      $addToSet: { voters: normalizedVoterId }
    },
    { new: true, runValidators: true }
  );

  if (updatedPoll) {
    res.json(updatedPoll);
    return;
  }

  const existingPoll = await Poll.findById(id);
  if (!existingPoll) {
    res.status(404).json({ message: "Poll not found." });
    return;
  }
  if (existingPoll.voters.includes(normalizedVoterId)) {
    res.status(409).json({ message: "You have already voted in this poll." });
    return;
  }
  if (existingPoll.closesAt && existingPoll.closesAt <= new Date()) {
    res.status(410).json({ message: "This poll is closed." });
    return;
  }

  res.status(400).json({ message: "The selected option does not belong to this poll." });
});

export const getPollResults = asyncHandler(async (req: Request, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).json({ message: "Invalid poll ID." });
    return;
  }

  const poll = await Poll.findById(req.params.id).lean();
  if (!poll) {
    res.status(404).json({ message: "Poll not found." });
    return;
  }

  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
  res.json({
    pollId: poll._id,
    question: poll.question,
    category: poll.category || "Campus",
    closesAt: poll.closesAt || null,
    totalVotes,
    options: poll.options.map((option) => ({
      id: option._id,
      text: option.text,
      votes: option.votes,
      percentage: totalVotes === 0
        ? 0
        : Math.round((option.votes / totalVotes) * 100)
    }))
  });
});
