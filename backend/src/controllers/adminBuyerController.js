const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const buyerService = require("../services/buyerService");

const listBuyers = asyncHandler(async (req, res) => {
  const buyers = await buyerService.listBuyers();
  sendSuccess(res, 200, { buyers });
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
