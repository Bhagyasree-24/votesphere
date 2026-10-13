import mongoose, { Document, Schema } from "mongoose";

export interface IPollOption {
  _id: mongoose.Types.ObjectId;
  text: string;
  votes: number;
}

export interface IPoll extends Document {
  question: string;
  category: string;
  closesAt: Date | null;
  options: IPollOption[];
  voters: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PollOptionSchema = new Schema<IPollOption>({
  text: { type: String, required: true, trim: true, maxlength: 100 },
  votes: { type: Number, default: 0, min: 0 }
});

const PollSchema = new Schema<IPoll>(
  {
    question: { type: String, required: true, trim: true, maxlength: 200 },
    category: {
      type: String,
      enum: ["Campus", "Events", "Facilities", "Safety", "Wellbeing", "Other"],
      default: "Campus"
    },
    closesAt: { type: Date, default: null },
    options: {
      type: [PollOptionSchema],
      required: true,
      validate: {
        validator: (items: IPollOption[]) => items.length >= 2 && items.length <= 6,
        message: "A poll must have between 2 and 6 options."
      }
    },
    voters: { type: [String], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model<IPoll>("Poll", PollSchema);
