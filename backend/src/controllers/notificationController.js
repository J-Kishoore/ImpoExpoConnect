const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const notificationService = require("../services/notificationService");

function recipientKey(user) {
  return user.role === "admin" ? "admin:all" : `buyer:${user.uid}`;
}

const listNotifications = asyncHandler(async (req, res) => {
  const { limit } = req.query;
  const result = await notificationService.listForRecipient(recipientKey(req.user), { limit });
  sendSuccess(res, 200, result);
});

const getUnreadCount = asyncHandler(async (req, res) => {
  const unreadCount = await notificationService.getUnreadCount(recipientKey(req.user));
  sendSuccess(res, 200, { unreadCount });
});

const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markAsRead(recipientKey(req.user), req.params.id);
  sendSuccess(res, 200, { notification });
});

const markAllNotificationsRead = asyncHandler(async (req, res) => {
  const result = await notificationService.markAllAsRead(recipientKey(req.user));
  sendSuccess(res, 200, result);
});

module.exports = { listNotifications, getUnreadCount, markNotificationRead, markAllNotificationsRead };
