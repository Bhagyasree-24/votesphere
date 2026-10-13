import mongoose, { Document, Schema } from "mongoose";

export interface IIssue extends Document {
  title: string;
  description: string;
  category: string;
  status: "Open" | "In Review" | "Resolved";
  createdAt: Date;
  updatedAt: Date;
}

const IssueSchema = new Schema<IIssue>(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 800 },
    category: { type: String, required: true, trim: true, maxlength: 60 },
    status: {
      type: String,
      enum: ["Open", "In Review", "Resolved"],
      default: "Open"
    }
  },
  { timestamps: true }
);

export default mongoose.model<IIssue>("Issue", IssueSchema);
