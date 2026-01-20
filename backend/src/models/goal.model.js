import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        deadline: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["not_started", "in_progress", "completed"],
            default: "not_started",
        },
        progress: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },
        category: {
            type: String,
            enum: ["Learning", "Project", "Placement", "Personal", "Other"],
            default: "Other",
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Goal = mongoose.model("Goal", goalSchema);
