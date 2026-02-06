require("dotenv").config();
const express = require("express"); 
const cors = require("cors");
const connectDB = require("./config/db");


const authRouter = require("./routes/auth");
const userRouter = require("./routes/usersdata");
const taskRouter = require("./routes/tasks");
const projectRoutes = require("./routes/projects");



const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
connectDB();

app.use(express.json());       

app.get("/", (req, res) => {
  res.send("task-manager backend  is running...");
});

//allow json from frontend
app.use(cors());
app.use(express.json());

//testing route
app.get("/", (req, res) => {
  res.send("API is running...");
});

//routes
app.use("/api/users", userRouter); //users route

app.use("/api/auth", authRouter); //auth route

app.use("/api/tasks", taskRouter); //tasks route

app.use("/api/projects",projectRoutes); //projects route

app.use("/api/auth",require("./routes/auth")); //auth route



//server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});