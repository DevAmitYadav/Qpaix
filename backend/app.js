
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import studentRoutes from "./routes/studentRoutes.js";
import connectDB from "./config/db.js";

const app = express();

dotenv.config();
app.use(express.json());

const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/students", studentRoutes);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
