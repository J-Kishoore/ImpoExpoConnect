const { verifyToken } = require("../utils/jwt");
const { ApiError } = require("../utils/ApiError");

function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return next(new ApiError(401, "Missing or invalid Authorization header."));
  }
  try {
    const payload = verifyToken(token);
    req.user = { uid: payload.sub, role: payload.role, email: payload.email };
    next();
  } catch (err) {
    next(new ApiError(401, "Invalid or expired token."));
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, "You do not have permission to perform this action."));
    }
    next();
  };
}

module.exports = { authenticate, authorize };
