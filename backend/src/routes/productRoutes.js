const { Router } = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const productService = require("../services/productService");

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const products = await productService.listProducts();
    sendSuccess(res, 200, { products });
  })
);

module.exports = router;
