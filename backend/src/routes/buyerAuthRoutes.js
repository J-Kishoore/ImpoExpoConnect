const { Router } = require("express");
const { registerBuyer, loginBuyer } = require("../controllers/authController");
const { authLimiter } = require("../middleware/rateLimiter");

const router = Router();

router.post("/register", authLimiter, registerBuyer);
router.post("/login", authLimiter, loginBuyer);

module.exports = router;
