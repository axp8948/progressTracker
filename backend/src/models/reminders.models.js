import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
    {
        reminderTitle: {
            type: String,
            required: true
        },

        date: {
            type: Date
        },

        classId: { 
            type: String, 
            required: true 
        }
    }
)

export const Reminder = mongoose.model("Reminder", reminderSchema);