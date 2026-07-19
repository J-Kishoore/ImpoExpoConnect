const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const orderService = require("../services/orderService");

const listOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.listAllOrders();
  sendSuccess(res, 200, { orders });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(req.params.id, req.body);
  sendSuccess(res, 200, { order });
});

module.exports = { listOrders, updateOrderStatus };
