const { Router } = require("express");
const { listPayments, reviewPayment } = require("../controllers/adminPaymentController");
const { authenticate, authorize } = require("../middleware/auth");

const router = Router();

router.use(authenticate, authorize("admin"));

router.get("/", listPayments);
router.patch("/:id", reviewPayment);

module.exports = router;
