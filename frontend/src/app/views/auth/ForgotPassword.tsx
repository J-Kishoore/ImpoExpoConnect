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

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle={role === "buyer" ? "We'll email you a link to reset your password" : "Enter your admin email to reset your password"}
    >
      {sent ? (
        <div className="space-y-4 text-center">
          <p className="text-sm text-foreground leading-relaxed">
            If an account exists for <span className="font-medium">{email}</span>, a password reset link is on its way.
            The link is valid for 15 minutes.
          </p>
          <Btn variant="primary" className="w-full justify-center" onClick={() => setView(loginView)}>
            Back to Sign In
          </Btn>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30" />
          </div>
          <Btn type="submit" variant="primary" size="lg" disabled={submitting} className="w-full justify-center">
            {submitting ? "Sending..." : "Send Reset Link"}
          </Btn>
        </form>
      )}
      <p className="text-xs text-muted-foreground text-center mt-5">
        Remembered your password?{" "}
        <button type="button" onClick={() => setView(loginView)} className="text-[#1e5c3a] font-medium hover:underline">Sign in</button>
      </p>
    </AuthLayout>
  );
}
