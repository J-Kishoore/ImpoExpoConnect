const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const dashboardService = require("../services/dashboardService");

const getStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getDashboardStats();
  sendSuccess(res, 200, { stats });
});

module.exports = { getStats };
