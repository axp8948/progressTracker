import express from "express"
import { Reminder } from "../models/reminders.models.js"

const router = express.Router();

// Save the reminder to the database
router.post("/reminders", async(req, res) => {
    console.log("POST /reminder request received"); // Debugging

    try {
        const {reminderTitle, date, classId} = req.body;
        console.log("Received data:", req.body); // Debugging

        if (!reminderTitle || !classId){
            return res.status(400).json({ success: false, message: "Class ID and reminderTitle are required to save the note" });
        }

        const newReminder = new Reminder({
            reminderTitle : reminderTitle,
            date: date,
            classId: classId
        })

        const savedReminder = await newReminder.save();
        console.log("Reminder saved Successfully", savedReminder); // Debugging

        res.json({ success: true, message: "Reminder saved!" });

    } catch (error) {
        console.error("Error saving Reminder!");
        res.status(500).json({success: false, message: "Error saving Reminder!"})
    }
})

// Retrieve the reminder from database
router.get("/reminders", async(req, res) => {
    try {
        const {classId} = req.query;
        if(!classId){
            return res.status(400).json({success: false, message: "Class Id is required to retrieve the reminder!" });
        }

        const retrievedReminders = await Reminder.find({classId});
        res.json(retrievedReminders);

    } catch (error) {
        console.error("Error retrieving the reminders", error);
        res.status(500).json({ success: false, message: "Error retrieving reminders!" });
    }
})

export default router;