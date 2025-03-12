import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import noteRoutes from "./routes/noteRoutes.js";
import reminderRoutes from "./routes/reminderRoutes.js"
import activityRoutes from "./routes/activityRoutes.js"

const app = express();

// app.use(cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true
// }));

app.use(cors({
    origin: "http://127.0.0.1:5500", // Allow your frontend's URL
    credentials: true
}));

app.use(express.json()); // Necessary for parsing request bodies
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Server is ready');
});

// For Notes
app.use("/api", noteRoutes);

// For Reminders
app.use("/api", reminderRoutes);

// For activities
app.use("/api", activityRoutes)

export { app };
