import { Router } from "express";
import {
  castVote,
  createPoll,
  getPollResults,
  getPolls
} from "../controllers/pollController";

const router = Router();

router.get("/", getPolls);
router.post("/", createPoll);
router.post("/:id/vote", castVote);
router.get("/:id/results", getPollResults);

export default router;
