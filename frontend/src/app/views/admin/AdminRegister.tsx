import { useState } from "react";
import type { FormEvent } from "react";
import { AuthLayout, Btn } from "../../components/shared";
import { useAuth } from "../../context/AuthContext";
import { ApiError } from "../../lib/api";
import type { View } from "../../types";

export function AdminRegister({ setView, showToast }: {
  setView: (v: View) => void;
  showToast: (m: string, t: "success" | "error" | "info") => void;
}) {
  const { registerAdmin } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      await registerAdmin({ name, email, password, inviteCode });
      showToast("Admin account created!", "success");
      setView("admin-dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to register. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Create an Admin Account" subtitle="Requires a valid invite code from your platform operator" data-testid="admin-register-page">
      <form onSubmit={submit} className="space-y-4" data-testid="admin-register-form">
        {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2" data-testid="admin-register-error">{error}</div>}
        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5" htmlFor="admin-register-name">Full Name *</label>
          <input required name="name" id="admin-register-name" value={name} onChange={e => setName(e.target.value)}
            autoComplete="name" aria-label="Full Name" data-testid="admin-register-name-input"
            className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30" />
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5" htmlFor="admin-register-email">Email *</label>
          <input type="email" name="email" id="admin-register-email" required value={email} onChange={e => setEmail(e.target.value)}
            autoComplete="email" aria-label="Email" data-testid="admin-register-email-input"
            className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30" />
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5" htmlFor="admin-register-invite-code">Invite Code *</label>
          <input required name="inviteCode" id="admin-register-invite-code" value={inviteCode} onChange={e => setInviteCode(e.target.value)}
            autoComplete="off" aria-label="Invite Code" data-testid="admin-register-invite-code-input"
            className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5" htmlFor="admin-register-password">Password *</label>
            <input type="password" name="password" id="admin-register-password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)}
              autoComplete="new-password" aria-label="Password" data-testid="admin-register-password-input"
              className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30" />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5" htmlFor="admin-register-confirm-password">Confirm Password *</label>
            <input type="password" name="confirmPassword" id="admin-register-confirm-password" required minLength={8} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              autoComplete="new-password" aria-label="Confirm Password" data-testid="admin-register-confirm-password-input"
              className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30" />
          </div>
        </div>
        <Btn type="submit" variant="primary" size="lg" disabled={submitting} className="w-full justify-center" data-testid="admin-register-submit-button">
          {submitting ? "Creating account..." : "Create Admin Account"}
        </Btn>
      </form>
      <p className="text-xs text-muted-foreground text-center mt-5">
        Already have an account?{" "}
        <button type="button" onClick={() => setView("admin-login")} className="text-[#1e5c3a] font-medium hover:underline" data-testid="admin-register-login-link">Sign In</button>
      </p>
    </AuthLayout>
  );
}
