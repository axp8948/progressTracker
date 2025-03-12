import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
    {
        activityName: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        timeSpent: { 
            type: Number,  
            required: true
        },
        classId: { 
            type: String, 
            required: true 
        }
    }
);

export const Activity = mongoose.model("Activity", activitySchema);