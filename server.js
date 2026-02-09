import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import authRouter from "./routes/auth.js";
import userRouter from "./routes/usersdata.js";
import taskRouter from "./routes/tasks.js";
import projectRoutes from "./routes/projects.js";

const app = express();

// middleware
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.json());

// debug
console.log("MONGO_URI:", process.env.MONGO_URI);

// db
connectDB();

// routes
app.get("/", (req, res) => {
  res.send("Task Manager backend is running...");
});

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/projects", projectRoutes);

// server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
