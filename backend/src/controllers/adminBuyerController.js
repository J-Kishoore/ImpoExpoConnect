const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const buyerService = require("../services/buyerService");

const listBuyers = asyncHandler(async (req, res) => {
  const { limit, cursor } = req.query;
  const result = await buyerService.listBuyers({ limit, cursor });
  sendSuccess(res, 200, result);
});

const updateBuyer = asyncHandler(async (req, res) => {
  const buyer = await buyerService.updateBuyer(req.params.id, req.body);
  sendSuccess(res, 200, { buyer });
});

const deleteBuyer = asyncHandler(async (req, res) => {
  await buyerService.deleteBuyer(req.params.id);
  sendSuccess(res, 200, { id: req.params.id });
});

module.exports = { listBuyers, updateBuyer, deleteBuyer };
