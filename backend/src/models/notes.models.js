import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    classId: { 
        type: String, 
        required: true 
    }, // Stores the class ID to associate notes with a class
    notes: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

export const Note = mongoose.model("Note", noteSchema);
