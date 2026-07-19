const { Router } = require("express");
const { createPayment, listMyPayments } = require("../controllers/buyerPaymentController");
const { authenticate, authorize } = require("../middleware/auth");
const { uploadPaymentProof } = require("../middleware/upload");

const router = Router();

router.use(authenticate, authorize("buyer"));

router.post("/", uploadPaymentProof, createPayment);
router.get("/", listMyPayments);

module.exports = router;
