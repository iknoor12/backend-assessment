const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.json({ message: "System API is running." });
});

app.use("/api/auth", require("./routes/authRoutes"));

app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT}`);
});