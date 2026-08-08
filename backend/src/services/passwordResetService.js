const { db } = require("../config/firebase");
const { config } = require("../config/env");
const { ApiError } = require("../utils/ApiError");
const { hashPassword } = require("../utils/password");
const { isStrongPassword } = require("../utils/validators");
const tokenService = require("./tokenService");
const emailService = require("./emailService");

const USERS = { buyer: "buyers", admin: "admins" };

async function findByEmail(collection, email) {
  const snap = await db.collection(collection).where("email", "==", email).limit(1).get();
  return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
}

// Always returns success (even for unknown emails) so the endpoint can't be used
// to probe which addresses have accounts.
async function requestPasswordReset({ email, role }) {
  const normalizedEmail = String(email).toLowerCase().trim();
  const user = await findByEmail(USERS[role], normalizedEmail);
  if (user) {
    const { token } = await tokenService.createToken({
      role,
      userId: user.id,
      purpose: "reset",
      ttl: config.token.resetTtl,
    });
    const link = `${config.frontendUrl}/reset-password?token=${token}&role=${role}`;
    const name = role === "buyer" ? user.companyName : user.name;
    emailService.sendEmail({
      to: normalizedEmail,
      subject: "Reset your ImpoExpo Connect password",
      html: emailService.renderLayout({
        heading: "Password reset requested",
        paragraphs: [
          `Hi ${name}, we received a request to reset the password for your ImpoExpo Connect account. This link is valid for 15 minutes.`,
          "If you didn't request this, you can safely ignore this email.",
        ],
        cta: { label: "Reset password", href: link },
      }),
    });
  }
  return { success: true };
}

async function resetPassword({ token, role, newPassword }) {
  if (!isStrongPassword(newPassword)) throw new ApiError(400, "Password must be at least 8 characters.");
  const { userId } = await tokenService.consumeToken({ token, role, purpose: "reset" });
  const passwordHash = await hashPassword(newPassword);
  await db.collection(USERS[role]).doc(userId).update({
    passwordHash,
    updatedAt: new Date().toISOString(),
  });
  return { success: true };
}

module.exports = { requestPasswordReset, resetPassword };
