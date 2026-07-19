const { Router } = require("express");
const { getStats } = require("../controllers/adminDashboardController");
const { authenticate, authorize } = require("../middleware/auth");

const router = Router();

router.use(authenticate, authorize("admin"));

router.get("/", getStats);

module.exports = router;
