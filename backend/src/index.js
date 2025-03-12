import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js"; // Import the app here

dotenv.config({
    path: './env'
});

connectDB()
  .then(() => {
    // Start the server only after the database connection is successful
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running at http://localhost:${process.env.PORT || 3000}`);
    });
    console.log("MongoDB connected!");
  })
  .catch((err) => {
    console.log("MongoDB connection failed:", err);
  });
