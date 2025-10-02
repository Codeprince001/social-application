// Centralized Error Middleware
export function errorHandler(err, req, res, next) {
  console.error(err.stack); // useful for debugging

  // Set default status code
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    // Only include stack trace in development
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
}
