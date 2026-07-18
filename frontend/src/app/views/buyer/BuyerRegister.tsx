import { useState } from "react";
import type { FormEvent } from "react";
import { AuthLayout, Btn } from "../../components/shared";
import { useAuth } from "../../context/AuthContext";
import { ApiError } from "../../lib/api";
import type { View } from "../../types";

export function BuyerRegister({ setView, showToast }: {
  setView: (v: View) => void;
  showToast: (m: string, t: "success" | "error" | "info") => void;
}) {
  const { registerBuyer } = useAuth();
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
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
      await registerBuyer({ companyName, contactName, email, password, country, phone });
      showToast("Account created! Your registration is pending approval.", "success");
      setView("buyer-dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to register. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Create a Buyer Account" subtitle="Register to request bulk quotations and track orders">
      <form onSubmit={submit} className="space-y-4">
        {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Company Name *</label>
            <input required value={companyName} onChange={e => setCompanyName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30" />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Contact Name *</label>
            <input required value={contactName} onChange={e => setContactName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5">Email *</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Country</label>
            <input value={country} onChange={e => setCountry(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30" />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Phone</label>
            <input value={phone} onChange={e => setPhone(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Password *</label>
            <input type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30" />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Confirm Password *</label>
            <input type="password" required minLength={8} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30" />
          </div>
        </div>
        <Btn type="submit" variant="primary" size="lg" disabled={submitting} className="w-full justify-center">
          {submitting ? "Creating account..." : "Create Account"}
        </Btn>
      </form>
      <p className="text-xs text-muted-foreground text-center mt-5">
        Already have an account?{" "}
        <button type="button" onClick={() => setView("buyer-login")} className="text-[#1e5c3a] font-medium hover:underline">Sign In</button>
      </p>
    </AuthLayout>
  );
}
