const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email) {
  return typeof email === "string" && EMAIL_RE.test(email);
}

function isStrongPassword(password) {
  return typeof password === "string" && password.length >= 8;
}

module.exports = { isValidEmail, isStrongPassword };
