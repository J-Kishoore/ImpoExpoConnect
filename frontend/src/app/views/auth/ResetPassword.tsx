import { useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "react-router";
import { AuthLayout, Btn } from "../../components/shared";
import { ApiError, resetPassword } from "../../lib/api";
import type { View } from "../../types";

export function ResetPassword({ setView }: { setView: (v: View) => void }) {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const role: "buyer" | "admin" = params.get("role") === "admin" ? "admin" : "buyer";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const loginView = role === "buyer" ? "buyer-login" : "admin-login";

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      await resetPassword(role, token, password);
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to reset your password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout title="Invalid Link" subtitle="Password reset" data-testid="reset-password-invalid-page">
        <p className="text-sm text-muted-foreground text-center">
          This reset link is missing or malformed. Please request a new one.
        </p>
        <Btn variant="primary" size="lg" className="w-full justify-center mt-4" onClick={() => setView(loginView)} data-testid="reset-password-invalid-back-button">
          Back to Sign In
        </Btn>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Set a New Password" subtitle={role === "buyer" ? "Choose a new password for your buyer account" : "Choose a new password for your admin account"} data-testid="reset-password-page">
      {done ? (
        <div className="space-y-4 text-center" data-testid="reset-password-success">
          <p className="text-sm text-foreground leading-relaxed">Your password has been updated. You can now sign in with your new password.</p>
          <Btn variant="primary" className="w-full justify-center" onClick={() => setView(loginView)} data-testid="reset-password-login-button">
            Sign In
          </Btn>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4" data-testid="reset-password-form">
          {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2" data-testid="reset-password-error">{error}</div>}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5" htmlFor="reset-password-new-password">New Password</label>
            <input type="password" name="password" id="reset-password-new-password" required value={password} onChange={e => setPassword(e.target.value)}
              autoComplete="new-password" aria-label="New Password" data-testid="reset-password-new-password-input"
              className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30" />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5" htmlFor="reset-password-confirm-password">Confirm Password</label>
            <input type="password" name="confirm" id="reset-password-confirm-password" required value={confirm} onChange={e => setConfirm(e.target.value)}
              autoComplete="new-password" aria-label="Confirm Password" data-testid="reset-password-confirm-password-input"
              className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30" />
          </div>
          <Btn type="submit" variant="primary" size="lg" disabled={submitting} className="w-full justify-center" data-testid="reset-password-submit-button">
            {submitting ? "Updating..." : "Update Password"}
          </Btn>
        </form>
      )}
    </AuthLayout>
  );
}
