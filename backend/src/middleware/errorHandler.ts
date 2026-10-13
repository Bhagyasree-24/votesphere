import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);

  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({ message: "Invalid JSON request body." });
    return;
  }

  res.status(500).json({ message: "An unexpected server error occurred." });
};
