const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const paymentService = require("../services/paymentService");

const listPayments = asyncHandler(async (req, res) => {
  const payments = await paymentService.listAllPayments();
  sendSuccess(res, 200, { payments });
});

const reviewPayment = asyncHandler(async (req, res) => {
  const payment = await paymentService.reviewPayment(req.params.id, req.body);
  sendSuccess(res, 200, { payment });
});

module.exports = { listPayments, reviewPayment };
