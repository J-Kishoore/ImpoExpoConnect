const { Router } = require("express");
const { listCategories, createCategory, updateCategory, deleteCategory } = require("../controllers/adminCategoryController");
const { authenticate, authorize } = require("../middleware/auth");

const router = Router();

router.use(authenticate, authorize("admin"));

router.get("/", listCategories);
router.post("/", createCategory);
router.patch("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
