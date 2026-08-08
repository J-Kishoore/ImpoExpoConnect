import { useState } from "react";
import type { FormEvent } from "react";
import { AuthLayout, Btn } from "../../components/shared";
import { useAuth } from "../../context/AuthContext";
import { ApiError } from "../../lib/api";
import type { View } from "../../types";

export function AdminLogin({ setView, showToast }: {
  setView: (v: View) => void;
  showToast: (m: string, t: "success" | "error" | "info") => void;
}) {
  const { loginAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await loginAdmin(email, password);
      showToast("Welcome back!", "success");
      setView("admin-dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Admin Sign In" subtitle="Manage buyers, orders, and payments" data-testid="admin-login-page">
      <form onSubmit={submit} className="space-y-4" data-testid="admin-login-form">
        {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2" data-testid="admin-login-error">{error}</div>}
        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5" htmlFor="admin-login-email">Email</label>
          <input type="email" name="email" id="admin-login-email" required value={email} onChange={e => setEmail(e.target.value)}
            autoComplete="email" placeholder="you@makgrowimpex.com" data-testid="admin-login-email-input"
            className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30" />
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5" htmlFor="admin-login-password">Password</label>
          <input type="password" name="password" id="admin-login-password" required value={password} onChange={e => setPassword(e.target.value)}
            autoComplete="current-password" aria-label="Password" data-testid="admin-login-password-input"
            className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30" />
        </div>
        <div className="flex items-center justify-end">
          <button type="button" onClick={() => setView("admin-forgot-password")} className="text-xs text-[#1e5c3a] font-medium hover:underline" data-testid="admin-login-forgot-password-link">
            Forgot password?
          </button>
        </div>
        <Btn type="submit" variant="primary" size="lg" disabled={submitting} className="w-full justify-center" data-testid="admin-login-submit-button">
          {submitting ? "Signing in..." : "Sign In"}
        </Btn>
      </form>
      <p className="text-xs text-muted-foreground text-center mt-5">
        Have an invite code?{" "}
        <button type="button" onClick={() => setView("admin-register")} className="text-[#1e5c3a] font-medium hover:underline" data-testid="admin-login-register-link">Create an admin account</button>
      </p>
      <p className="text-xs text-muted-foreground text-center mt-2">
        <button type="button" onClick={() => setView("buyer-login")} className="hover:underline" data-testid="admin-login-buyer-link">Buyer? Sign in here</button>
      </p>
    </AuthLayout>
  );
}
