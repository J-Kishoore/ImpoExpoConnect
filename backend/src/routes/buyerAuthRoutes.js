const { Router } = require("express");
const {
  registerBuyer,
  loginBuyer,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
} = require("../controllers/authController");
const { authLimiter } = require("../middleware/rateLimiter");

const router = Router();

router.post("/register", authLimiter, registerBuyer);
router.post("/login", authLimiter, loginBuyer);
router.post("/forgot-password", authLimiter, forgotPassword("buyer"));
router.post("/reset-password", authLimiter, resetPassword("buyer"));
router.post("/verify-email", authLimiter, verifyEmail);
router.post("/resend-verification", authLimiter, resendVerificationEmail);

module.exports = router;
