const rateLimit = require("express-rate-limit");
// Apply rate limiting to all API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 100 requests per 15 minutes
  message: "Too many requests, please try again later.",
});
module.exports = apiLimiter;
