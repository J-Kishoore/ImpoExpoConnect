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
      <AuthLayout title="Invalid Link" subtitle="Password reset">
        <p className="text-sm text-muted-foreground text-center">
          This reset link is missing or malformed. Please request a new one.
        </p>
        <Btn variant="primary" size="lg" className="w-full justify-center mt-4" onClick={() => setView(loginView)}>
          Back to Sign In
        </Btn>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Set a New Password" subtitle={role === "buyer" ? "Choose a new password for your buyer account" : "Choose a new password for your admin account"}>
      {done ? (
        <div className="space-y-4 text-center">
          <p className="text-sm text-foreground leading-relaxed">Your password has been updated. You can now sign in with your new password.</p>
          <Btn variant="primary" className="w-full justify-center" onClick={() => setView(loginView)}>
            Sign In
          </Btn>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">New Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30" />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Confirm Password</label>
            <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30" />
          </div>
          <Btn type="submit" variant="primary" size="lg" disabled={submitting} className="w-full justify-center">
            {submitting ? "Updating..." : "Update Password"}
          </Btn>
        </form>
      )}
    </AuthLayout>
  );
}
