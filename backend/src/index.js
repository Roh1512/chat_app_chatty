import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const port = process.env.PORT;

const __dirname = path.resolve();

app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" })); // Adjust the size as needed
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true })); // For form-data

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    return res.sendFile(
      path.join(__dirname, "../frontend", "dist", "index.html")
    );
  });
}

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
  connectDB();
});
