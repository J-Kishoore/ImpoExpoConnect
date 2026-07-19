const { Router } = require("express");
const buyerAuthRoutes = require("./buyerAuthRoutes");
const adminAuthRoutes = require("./adminAuthRoutes");
const adminBuyerRoutes = require("./adminBuyerRoutes");
const adminCategoryRoutes = require("./adminCategoryRoutes");
const adminProductRoutes = require("./adminProductRoutes");
const productRoutes = require("./productRoutes");
const buyerOrderRoutes = require("./buyerOrderRoutes");
const adminOrderRoutes = require("./adminOrderRoutes");
const adminDashboardRoutes = require("./adminDashboardRoutes");
const buyerPaymentRoutes = require("./buyerPaymentRoutes");
const adminPaymentRoutes = require("./adminPaymentRoutes");
const paymentFileRoutes = require("./paymentFileRoutes");
const { getMe } = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");

const router = Router();

router.get("/health", (req, res) => res.json({ success: true, message: "OK" }));
router.use("/products", productRoutes);
router.use("/buyer/orders", buyerOrderRoutes);
router.use("/buyer/payments", buyerPaymentRoutes);
router.use("/buyer", buyerAuthRoutes);
router.use("/admin/buyers", adminBuyerRoutes);
router.use("/admin/categories", adminCategoryRoutes);
router.use("/admin/products", adminProductRoutes);
router.use("/admin/orders", adminOrderRoutes);
router.use("/admin/dashboard", adminDashboardRoutes);
router.use("/admin/payments", adminPaymentRoutes);
router.use("/admin", adminAuthRoutes);
router.use("/payments", paymentFileRoutes);
router.get("/me", authenticate, getMe);

module.exports = router;
