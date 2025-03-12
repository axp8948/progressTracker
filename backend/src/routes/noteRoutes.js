import express from "express";
import { Note } from "../models/notes.models.js";

const router = express.Router();

// Save the note to the database with classId
router.post("/notes", async (req, res) => {
  console.log("POST /notes request received"); // Debugging
  try {
    const { notes, classId } = req.body;
    console.log("Received data:", req.body); // Debugging

    // Check if both fields are present
    if (!notes || !classId) {
      return res.status(400).json({ success: false, message: "Class ID and Note are required" });
    }

    const newNote = new Note({
      notes: notes,
      classId: classId,
    });

    // Attempt to save to the database
    const savedNote = await newNote.save();
    console.log("Note saved successfully:", savedNote); // Debugging

    res.json({ success: true, message: "Note saved!" });
  } catch (error) {
    console.error("Error saving note:", error);
    res.status(500).json({ success: false, message: "Error saving note" });
  }
});


// Retrieve notes filtered by classId
router.get("/notes", async (req, res) => {
  try {
    const { classId } = req.query; // Get classId from query parameters
    if (!classId) {
      return res.status(400).json({ success: false, message: "Class ID is required to retrieve the data" });
    }

    const retrievedNotes = await Note.find({ classId });
    res.json(retrievedNotes);
  } catch (error) {
    console.error("Error retrieving the notes:", error);
    res.status(500).json({ success: false, message: "Error retrieving the notes" });
  }
});

export default router;


