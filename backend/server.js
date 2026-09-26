const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const requestRoutes = require("./routes/requestRoutes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
console.log("REQUEST ROUTES LOADED");
app.use("/api/requests", requestRoutes);

app.get("/",(req,res)=>{
    res.json({
        message: "SkillSwap backend is running !"
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});