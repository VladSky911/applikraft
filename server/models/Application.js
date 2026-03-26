const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["applied", "interview", "rejected", "offer"],
      default: "applied",
    },
    notes: {
      type: String,
      trim: true,
    },
    screenshots: [
      {
        type: String,
      },
    ],
    appliedDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Application", applicationSchema);
