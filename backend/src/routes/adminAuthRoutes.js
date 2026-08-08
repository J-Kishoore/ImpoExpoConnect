const { Router } = require("express");
const { registerAdmin, loginAdmin, forgotPassword, resetPassword } = require("../controllers/authController");
const { authLimiter } = require("../middleware/rateLimiter");

const router = Router();

router.post("/register", authLimiter, registerAdmin);
router.post("/login", authLimiter, loginAdmin);
router.post("/forgot-password", authLimiter, forgotPassword("admin"));
router.post("/reset-password", authLimiter, resetPassword("admin"));

module.exports = router;
