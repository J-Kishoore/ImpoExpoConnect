const { Router } = require("express");
const { listProducts, createProduct, updateProduct, deleteProduct } = require("../controllers/adminProductController");
const { authenticate, authorize } = require("../middleware/auth");

const router = Router();

router.use(authenticate, authorize("admin"));

router.get("/", listProducts);
router.post("/", createProduct);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
