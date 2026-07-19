const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const paymentService = require("../services/paymentService");

const createPayment = asyncHandler(async (req, res) => {
  const payment = await paymentService.createPayment(req.user.uid, req.body, req.file);
  sendSuccess(res, 201, { payment });
});

const listMyPayments = asyncHandler(async (req, res) => {
  const payments = await paymentService.listPaymentsForBuyer(req.user.uid);
  sendSuccess(res, 200, { payments });
});

module.exports = { createPayment, listMyPayments };
