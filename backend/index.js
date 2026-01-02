import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import connectDB from "./config/database.js";
import errorHandler from "./middlewares/errorhandler.js";

export const app = express();
const server = http.createServer(app);
dotenv.config();

const port = process.env.PORT || 4000; 


//middleware
app.use(apiLimiter);
app.use(express.json());
app.use(cors());


//api creation
app.get("/", (req, res) => {
  res.send("Express app is running");
});

connectDB();

app.use(errorHandler);


server.listen(port, (error) => {
  if (!error) {
    console.log("server is running on port", port);
    console.log(`WebSocket ready on ws://localhost:${port}`);
  } else {
    console.log("Error :", error);
  }
});

process.on("unhandledRejection", (reason, promise) => {
  console.log(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  app.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.log(`Uncaught Exception: ${error.message}`);
  app.close(() => process.exit(1));
});