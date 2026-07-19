const asyncHandler = require("../utils/asyncHandler");
const paymentService = require("../services/paymentService");

const downloadPaymentFile = asyncHandler(async (req, res) => {
  const { filePath, fileName, mimeType } = await paymentService.getPaymentFileInfo(req.params.id, req.user);
  res.setHeader("Content-Type", mimeType);
  res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(fileName)}"`);
  res.sendFile(filePath);
});

module.exports = { downloadPaymentFile };
