import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import connectDB from "./config/database.js";
import errorHandler from "./middlewares/errorhandler.js";
import {websiteLockMiddleware} from "./middlewares/websiteLock.js";
import logger from "./middlewares/logger.js";


import adminRoute from "./routes/adminRoute.js";
import productRoute from "./routes/productRoute.js";
import lockRoute from "./routes/lockRoute.js";
import reviewRoute from "./routes/reviewRoute.js";
import orderRoute from "./routes/orderRoute.js";
import newsletterRoute from "./routes/newsletterRoute.js";
import promoRoute from "./routes/promoRoute.js";
import galleryRoute from "./routes/galleryRoutes.js"
import eventRoute from "./routes/eventRoute.js";
import showcaseRoute from "./routes/showcaseRoute.js";
import { paystackWebhook } from "./controllers/orderController.js";

import dns from "node:dns";

// Set the DNS servers to Google's public DNS
dns.setServers(["8.8.8.8", "8.8.4.4"]);


export const app = express();
const server = http.createServer(app);
dotenv.config();

const port = process.env.PORT || 4000; 


//middleware
app.use(cors());
app.use(apiLimiter);

// Paystack webhook needs raw body for signature verification — mount BEFORE express.json()
app.post('/order/webhooks/paystack', express.raw({ type: 'application/json' }), paystackWebhook);

app.use(express.json());
app.use(logger)


//api creation
app.get("/", (req, res) => {
  res.send("Express app is running");
});

await connectDB();

// app.use(websiteLockMiddleware)

// Routes
app.use('/admin', adminRoute);
app.use('/product', productRoute);
app.use('/lock', lockRoute);
app.use('/review', reviewRoute);
app.use('/order', orderRoute);
app.use('/newsletter', newsletterRoute);
app.use('/promo', promoRoute);
app.use('/gallery', galleryRoute);
app.use('/event', eventRoute);
app.use('/showcase', showcaseRoute);

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