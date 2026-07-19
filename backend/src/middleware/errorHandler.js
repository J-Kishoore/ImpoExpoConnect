const multer = require("multer");
const { ApiError } = require("../utils/ApiError");

function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

function errorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    const message = err.code === "LIMIT_FILE_SIZE" ? "File is too large (max 10MB)." : err.message;
    return res.status(400).json({ success: false, message });
  }

  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message =
    statusCode === 500 && process.env.NODE_ENV === "production"
      ? "Something went wrong."
      : err.message;

  if (statusCode === 500) console.error(err);

  res.status(statusCode).json({ success: false, message });
}

module.exports = { notFound, errorHandler };
