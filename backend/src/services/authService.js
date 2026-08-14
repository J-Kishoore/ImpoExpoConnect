const { db } = require("../config/firebase");
const { hashPassword, comparePassword } = require("../utils/password");
const { signToken } = require("../utils/jwt");
const { ApiError } = require("../utils/ApiError");
const notificationService = require("./notificationService");
const emailVerificationService = require("./emailVerificationService");
const emailService = require("./emailService");

const BUYERS = "buyers";
const ADMINS = "admins";

function stripHash(id, data) {
  const { passwordHash, ...rest } = data;
  return { id, ...rest };
}

async function findByEmail(collection, email) {
  const snap = await db.collection(collection).where("email", "==", email).limit(1).get();
  return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
}

async function registerBuyer({ companyName, contactName, email, password, country, phone }) {
  const normalizedEmail = email.toLowerCase().trim();
  if (await findByEmail(BUYERS, normalizedEmail)) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const passwordHash = await hashPassword(password);
  const docRef = await db.collection(BUYERS).add({
    companyName,
    contactName,
    email: normalizedEmail,
    phone: phone || null,
    country: country || null,
    passwordHash,
    status: "Pending",
    emailVerified: false,
    createdAt: new Date().toISOString(),
  });

  const snap = await docRef.get();
  await notificationService.create({
    recipient: "admin:all",
    type: "buyer_registered",
    title: "New buyer registration",
    body: `${companyName} (${country || "country not specified"}) signed up and is awaiting approval.`,
    data: { buyerId: docRef.id, companyName, email: normalizedEmail },
    link: "/admin/buyers",
  });
  await emailVerificationService.requestVerification({
    userId: docRef.id,
    email: normalizedEmail,
    name: companyName,
  });
  const token = signToken({ sub: docRef.id, role: "buyer", email: normalizedEmail });
  return { token, buyer: stripHash(docRef.id, snap.data()) };
}

async function loginBuyer({ email, password }) {
  const normalizedEmail = email.toLowerCase().trim();
  const buyer = await findByEmail(BUYERS, normalizedEmail);
  if (!buyer || !(await comparePassword(password, buyer.passwordHash))) {
    throw new ApiError(401, "Invalid email or password.");
  }
  if (buyer.status === "Suspended") {
    throw new ApiError(403, "This account has been suspended. Contact support.");
  }

  const token = signToken({ sub: buyer.id, role: "buyer", email: normalizedEmail });
  return { token, buyer: stripHash(buyer.id, buyer) };
}

async function registerAdmin({ name, email, password }) {
  const normalizedEmail = email.toLowerCase().trim();
  if (await findByEmail(ADMINS, normalizedEmail)) {
    throw new ApiError(409, "An admin account with this email already exists.");
  }

  const passwordHash = await hashPassword(password);
  const docRef = await db.collection(ADMINS).add({
    name,
    email: normalizedEmail,
    passwordHash,
    createdAt: new Date().toISOString(),
  });

  const snap = await docRef.get();
  const token = signToken({ sub: docRef.id, role: "admin", email: normalizedEmail });
  return { token, admin: stripHash(docRef.id, snap.data()) };
}

async function loginAdmin({ email, password, meta = {} }) {
  const normalizedEmail = email.toLowerCase().trim();
  const admin = await findByEmail(ADMINS, normalizedEmail);
  if (!admin || !(await comparePassword(password, admin.passwordHash))) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const token = signToken({ sub: admin.id, role: "admin", email: normalizedEmail });
  notifyAdminLogin({ admin, meta });
  return { token, admin: stripHash(admin.id, admin) };
}

async function getProfile({ uid, role }) {
  const collection = role === "admin" ? ADMINS : BUYERS;
  const doc = await db.collection(collection).doc(uid).get();
  if (!doc.exists) throw new ApiError(404, "Account not found.");
  return stripHash(doc.id, doc.data());
}

function parseUserAgent(userAgent = "") {
  const ua = String(userAgent || "");
  let browser = "Unknown";
  if (/Edg\//i.test(ua)) browser = "Microsoft Edge";
  else if (/OPR\/|Opera/i.test(ua)) browser = "Opera";
  else if (/Trident|MSIE/i.test(ua)) browser = "Internet Explorer";
  else if (/Firefox/i.test(ua)) browser = "Firefox";
  else if (/Chrome/i.test(ua)) browser = "Chrome";
  else if (/Safari/i.test(ua)) browser = "Safari";

  let os = "Unknown";
  if (/Windows/i.test(ua)) os = "Windows";
  else if (/Mac OS X|Macintosh/i.test(ua)) os = "macOS";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/iPhone|iPad|iOS/i.test(ua)) os = "iOS";
  else if (/Linux/i.test(ua)) os = "Linux";

  return `${browser} / ${os}`;
}

function notifyAdminLogin({ admin, meta }) {
  const loginTime = new Date();
  const details = [
    { label: "Admin name", value: admin.name || "—" },
    { label: "Email", value: admin.email },
    { label: "Login time", value: loginTime.toLocaleString() },
  ];
  if (meta && meta.ip) details.push({ label: "IP address", value: meta.ip });
  details.push({ label: "Device / browser", value: parseUserAgent(meta && meta.userAgent) });

  emailService.sendEmail({
    to: admin.email,
    subject: "New admin login — ImpoExpo Connect",
    html: emailService.renderLayout({
      heading: "You are now logged in",
      paragraphs: [
        "You have successfully logged in to the ImpoExpo Connect admin panel.",
        "If this was you, no action is needed. If you do not recognize this login, change your password immediately.",
      ],
      details,
    }),
  });
}

module.exports = { registerBuyer, loginBuyer, registerAdmin, loginAdmin, getProfile };
