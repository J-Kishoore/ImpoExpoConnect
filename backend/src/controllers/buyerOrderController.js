const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const orderService = require("../services/orderService");

const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.user.uid, req.body);
  sendSuccess(res, 201, { order });
});

const listMyOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.listOrdersForBuyer(req.user.uid);
  sendSuccess(res, 200, { orders });
});

module.exports = { createOrder, listMyOrders };
