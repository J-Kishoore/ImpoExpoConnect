const { db } = require("../config/firebase");
const { config } = require("../config/env");
const tokenService = require("./tokenService");
const emailService = require("./emailService");

const BUYERS = "buyers";

async function requestVerification({ userId, email, name }) {
  await tokenService.invalidateTokens({ role: "buyer", userId, purpose: "verify" });
  const { token } = await tokenService.createToken({
    role: "buyer",
    userId,
    purpose: "verify",
    ttl: config.token.verificationTtl,
  });
  const link = `${config.frontendUrl}/verify-email?token=${token}`;
  emailService.sendEmail({
    to: email,
    subject: "Verify your email — ImpoExpo Connect",
    html: emailService.renderLayout({
      heading: "Verify your email address",
      paragraphs: [
        `Hi ${name}, welcome to ImpoExpo Connect. Confirm your email address to start placing bulk orders. This link is valid for 10 minutes.`,
        "If you didn't create this account, you can ignore this email.",
      ],
      cta: { label: "Verify email", href: link },
    }),
  });
}

async function verifyEmail({ token }) {
  const { userId } = await tokenService.consumeToken({ token, role: "buyer", purpose: "verify" });
  await db.collection(BUYERS).doc(userId).update({
    emailVerified: true,
    updatedAt: new Date().toISOString(),
  });
  return { success: true };
}

async function resendVerification({ email }) {
  const normalizedEmail = String(email).toLowerCase().trim();
  const snap = await db.collection(BUYERS).where("email", "==", normalizedEmail).limit(1).get();
  if (!snap.empty) {
    const buyer = snap.docs[0];
    await requestVerification({
      userId: buyer.id,
      email: normalizedEmail,
      name: buyer.data().companyName,
    });
  }
  return { success: true };
}

module.exports = { requestVerification, verifyEmail, resendVerification };
