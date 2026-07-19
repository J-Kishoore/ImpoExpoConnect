const { Router } = require("express");
const { createOrder, listMyOrders } = require("../controllers/buyerOrderController");
const { authenticate, authorize } = require("../middleware/auth");

const router = Router();

router.use(authenticate, authorize("buyer"));

router.post("/", createOrder);
router.get("/", listMyOrders);

module.exports = router;
