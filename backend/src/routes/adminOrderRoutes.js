const { Router } = require("express");
const { listOrders, updateOrderStatus } = require("../controllers/adminOrderController");
const { authenticate, authorize } = require("../middleware/auth");

const router = Router();

router.use(authenticate, authorize("admin"));

router.get("/", listOrders);
router.patch("/:id", updateOrderStatus);

module.exports = router;
