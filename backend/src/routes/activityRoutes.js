import express from "express"
import { Activity } from "../models/activity.models.js"

const router = express.Router();

// Route to save activity data
router.post('/saveActivity', async (req, res) => {
    try {
      const { activityName, date, timeSpent, classId } = req.body;
  
      // Create a new activity document
      const newActivity = new Activity({
        activityName,
        date,
        timeSpent,
        classId
      });
  
      // Save the activity
      await newActivity.save();
      res.status(200).json({ success: true, message: 'Activity saved successfully!' });
    } catch (error) {
      console.error('Error saving activity:', error);
      res.status(500).json({ success: false, message: 'Error saving activity!' });
    }
  });

// Route to retrieve the saved activities from the database
router.get('/getActivities', async (req, res) => {
    try {
        const { classId } = req.query;
        
        if (!classId) {
            return res.status(400).json({ success: false, message: "Class ID is required to retrieve the activities!" });
        }

        const retrievedActivities = await Activity.find({ classId });

        res.json(retrievedActivities);
    } catch (error) {
        console.error("Error retrieving the activities:", error);
        res.status(500).json({ success: false, message: "Error retrieving the activities" });
    }
});

export default router;

