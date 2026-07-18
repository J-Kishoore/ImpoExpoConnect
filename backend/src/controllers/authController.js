const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { ApiError } = require("../utils/ApiError");
const { isValidEmail, isStrongPassword } = require("../utils/validators");
const { config } = require("../config/env");
const authService = require("../services/authService");

const registerBuyer = asyncHandler(async (req, res) => {
  const { companyName, contactName, email, password, country, phone } = req.body;
  if (!companyName || !contactName || !email || !password) {
    throw new ApiError(400, "companyName, contactName, email and password are required.");
  }
  if (!isValidEmail(email)) throw new ApiError(400, "Invalid email address.");
  if (!isStrongPassword(password)) throw new ApiError(400, "Password must be at least 8 characters.");

  const result = await authService.registerBuyer({ companyName, contactName, email, password, country, phone });
  sendSuccess(res, 201, result);
});

const loginBuyer = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, "email and password are required.");

  const result = await authService.loginBuyer({ email, password });
  sendSuccess(res, 200, result);
});

const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, inviteCode } = req.body;
  if (!config.adminInviteCode || inviteCode !== config.adminInviteCode) {
    throw new ApiError(403, "A valid invite code is required to register an admin account.");
  }
  if (!name || !email || !password) {
    throw new ApiError(400, "name, email and password are required.");
  }
  if (!isValidEmail(email)) throw new ApiError(400, "Invalid email address.");
  if (!isStrongPassword(password)) throw new ApiError(400, "Password must be at least 8 characters.");

  const result = await authService.registerAdmin({ name, email, password });
  sendSuccess(res, 201, result);
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, "email and password are required.");

  const result = await authService.loginAdmin({ email, password });
  sendSuccess(res, 200, result);
});

const getMe = asyncHandler(async (req, res) => {
  const profile = await authService.getProfile(req.user);
  sendSuccess(res, 200, { role: req.user.role, profile });
});

module.exports = { registerBuyer, loginBuyer, registerAdmin, loginAdmin, getMe };
