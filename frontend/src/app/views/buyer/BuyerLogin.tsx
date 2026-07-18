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
    <AuthLayout title="Buyer Sign In" subtitle="Access your bulk ordering dashboard">
      <form onSubmit={submit} className="space-y-4">
        {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5">Email</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30" />
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5">Password</label>
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30" />
        </div>
        <Btn type="submit" variant="primary" size="lg" disabled={submitting} className="w-full justify-center">
          {submitting ? "Signing in..." : "Sign In"}
        </Btn>
      </form>
      <p className="text-xs text-muted-foreground text-center mt-5">
        Don't have an account?{" "}
        <button type="button" onClick={() => setView("buyer-register")} className="text-[#1e5c3a] font-medium hover:underline">Register</button>
      </p>
      <p className="text-xs text-muted-foreground text-center mt-2">
        <button type="button" onClick={() => setView("admin-login")} className="hover:underline">Admin? Sign in here</button>
      </p>
    </AuthLayout>
  );
}
