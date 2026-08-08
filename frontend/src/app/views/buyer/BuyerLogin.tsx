import { useState } from "react";
import type { FormEvent } from "react";
import { AuthLayout, Btn } from "../../components/shared";
import { useAuth } from "../../context/AuthContext";
import { ApiError } from "../../lib/api";
import type { View } from "../../types";

export function BuyerLogin({ setView, showToast }: {
  setView: (v: View) => void;
  showToast: (m: string, t: "success" | "error" | "info") => void;
}) {
  const { loginBuyer } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await loginBuyer(email, password);
      showToast("Welcome back!", "success");
      setView("buyer-dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Buyer Sign In" subtitle="Access your bulk ordering dashboard" data-testid="buyer-login-page">
      <form onSubmit={submit} className="space-y-4" data-testid="buyer-login-form">
        {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2" data-testid="buyer-login-error">{error}</div>}
        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5" htmlFor="buyer-login-email">Email</label>
          <input type="email" name="email" id="buyer-login-email" required value={email} onChange={e => setEmail(e.target.value)}
            autoComplete="email" placeholder="you@company.com" data-testid="buyer-login-email-input"
            className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30" />
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5" htmlFor="buyer-login-password">Password</label>
          <input type="password" name="password" id="buyer-login-password" required value={password} onChange={e => setPassword(e.target.value)}
            autoComplete="current-password" aria-label="Password" data-testid="buyer-login-password-input"
            className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30" />
        </div>
        <div className="flex items-center justify-end">
          <button type="button" onClick={() => setView("buyer-forgot-password")} className="text-xs text-[#1e5c3a] font-medium hover:underline" data-testid="buyer-login-forgot-password-link">
            Forgot password?
          </button>
        </div>
        <Btn type="submit" variant="primary" size="lg" disabled={submitting} className="w-full justify-center" data-testid="buyer-login-submit-button">
          {submitting ? "Signing in..." : "Sign In"}
        </Btn>
      </form>
      <p className="text-xs text-muted-foreground text-center mt-5">
        Don't have an account?{" "}
        <button type="button" onClick={() => setView("buyer-register")} className="text-[#1e5c3a] font-medium hover:underline" data-testid="buyer-login-register-link">Register</button>
      </p>
      <p className="text-xs text-muted-foreground text-center mt-2">
        <button type="button" onClick={() => setView("admin-login")} className="hover:underline" data-testid="buyer-login-admin-link">Admin? Sign in here</button>
      </p>
    </AuthLayout>
  );
}
