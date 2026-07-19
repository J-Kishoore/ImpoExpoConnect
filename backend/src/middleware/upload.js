const multer = require("multer");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { ApiError } = require("../utils/ApiError");

const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads", "payments");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_MIME_TYPES = new Set(["application/pdf", "image/jpeg", "image/png"]);
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB — matches the "PDF, JPG, PNG up to 10MB" copy in the UI

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${crypto.randomUUID()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      return cb(new ApiError(400, "Only PDF, JPG, and PNG files are allowed."));
    }
    cb(null, true);
  },
});

module.exports = { uploadPaymentProof: upload.single("file"), UPLOAD_DIR };
