import rateLimit from "express-rate-limit";

// Auth rate limiter
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 52, // Limit each IP to 5 requests per window
  message: {
    success: false,
    message: "Too many attempts, please try again later",
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable legacy headers
});

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins (Users won't wait an hour if blocked)
  max: 700, // Increased slightly for a smoother launch experience
  standardHeaders: true, // Returns rate limit info in headers
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP",
  },
});
