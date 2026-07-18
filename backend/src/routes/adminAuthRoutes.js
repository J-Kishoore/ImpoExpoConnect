const { Router } = require("express");
const { registerAdmin, loginAdmin } = require("../controllers/authController");
const { authLimiter } = require("../middleware/rateLimiter");

const router = Router();

router.post("/register", authLimiter, registerAdmin);
router.post("/login", authLimiter, loginAdmin);

module.exports = router;
