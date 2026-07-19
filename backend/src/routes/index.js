const { Router } = require("express");
const buyerAuthRoutes = require("./buyerAuthRoutes");
const adminAuthRoutes = require("./adminAuthRoutes");
const adminBuyerRoutes = require("./adminBuyerRoutes");
const adminCategoryRoutes = require("./adminCategoryRoutes");
const adminProductRoutes = require("./adminProductRoutes");
const { getMe } = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");

const router = Router();

router.get("/health", (req, res) => res.json({ success: true, message: "OK" }));
router.use("/buyer", buyerAuthRoutes);
router.use("/admin/buyers", adminBuyerRoutes);
router.use("/admin/categories", adminCategoryRoutes);
router.use("/admin/products", adminProductRoutes);
router.use("/admin", adminAuthRoutes);
router.get("/me", authenticate, getMe);

module.exports = router;
