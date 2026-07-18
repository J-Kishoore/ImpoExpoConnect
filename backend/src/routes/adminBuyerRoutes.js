const { Router } = require("express");
const { listBuyers, updateBuyer, deleteBuyer } = require("../controllers/adminBuyerController");
const { authenticate, authorize } = require("../middleware/auth");

const router = Router();

router.use(authenticate, authorize("admin"));

router.get("/", listBuyers);
router.patch("/:id", updateBuyer);
router.delete("/:id", deleteBuyer);

module.exports = router;
