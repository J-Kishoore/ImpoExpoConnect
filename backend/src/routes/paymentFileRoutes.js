const { Router } = require("express");
const { downloadPaymentFile } = require("../controllers/paymentFileController");
const { authenticate } = require("../middleware/auth");

const router = Router();

router.get("/:id/file", authenticate, downloadPaymentFile);

module.exports = router;
