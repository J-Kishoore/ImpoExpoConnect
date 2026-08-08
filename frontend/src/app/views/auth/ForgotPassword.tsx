import { useState } from "react";
import type { FormEvent } from "react";
import { AuthLayout, Btn } from "../../components/shared";
import { ApiError, forgotPassword } from "../../lib/api";
import type { View } from "../../types";

export function ForgotPassword({ role, setView }: {
  role: "buyer" | "admin";
  setView: (v: View) => void;
}) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await forgotPassword(role, email);
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to send reset email. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const loginView = role === "buyer" ? "buyer-login" : "admin-login";
  const testId = role === "buyer" ? "buyer" : "admin";

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle={role === "buyer" ? "We'll email you a link to reset your password" : "Enter your admin email to reset your password"}
      data-testid={`${testId}-forgot-password-page`}
    >
      {sent ? (
        <div className="space-y-4 text-center" data-testid={`${testId}-forgot-password-success`}>
          <p className="text-sm text-foreground leading-relaxed">
            If an account exists for <span className="font-medium">{email}</span>, a password reset link is on its way.
            The link is valid for 15 minutes.
          </p>
          <Btn variant="primary" className="w-full justify-center" onClick={() => setView(loginView)} data-testid={`${testId}-forgot-password-back-button`}>
            Back to Sign In
          </Btn>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4" data-testid={`${testId}-forgot-password-form`}>
          {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2" data-testid={`${testId}-forgot-password-error`}>{error}</div>}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5" htmlFor={`${testId}-forgot-password-email`}>Email</label>
            <input type="email" name="email" id={`${testId}-forgot-password-email`} required value={email} onChange={e => setEmail(e.target.value)}
              autoComplete="email" placeholder="you@company.com" data-testid={`${testId}-forgot-password-email-input`}
              className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30" />
          </div>
          <Btn type="submit" variant="primary" size="lg" disabled={submitting} className="w-full justify-center" data-testid={`${testId}-forgot-password-submit-button`}>
            {submitting ? "Sending..." : "Send Reset Link"}
          </Btn>
        </form>
      )}
      <p className="text-xs text-muted-foreground text-center mt-5">
        Remembered your password?{" "}
        <button type="button" onClick={() => setView(loginView)} className="text-[#1e5c3a] font-medium hover:underline" data-testid={`${testId}-forgot-password-login-link`}>Sign in</button>
      </p>
    </AuthLayout>
  );
}
