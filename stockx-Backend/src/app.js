import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());

app.use(cors({
  origin: ["http://localhost:3000", "https://stock-x-seven.vercel.app"],
  credentials: true
}));

// Basic settings to handle data
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Route imports
import userRouter from './routes/user.routes.js';
import subscribeRouter from './routes/subscribe.routes.js';

// Route declarations
app.use("/api/v1/users", userRouter);
app.use("/api/v1/newsletter", subscribeRouter);

export { app };
