import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

connectDB()
    .then(() => {
        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err);
    });
