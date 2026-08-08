import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { CheckCircle2, XCircle } from "lucide-react";
import { AuthLayout, Btn } from "../../components/shared";
import { ApiError, verifyEmail } from "../../lib/api";
import type { View } from "../../types";

export function VerifyEmail({ setView }: { setView: (v: View) => void }) {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [state, setState] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!token) {
      setError("This verification link is missing or malformed. Please request a new one.");
      setState("error");
      return;
    }
    verifyEmail(token)
      .then(() => { if (!cancelled) setState("success"); })
      .catch(err => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Unable to verify your email. Please try again.");
        setState("error");
      });
    return () => { cancelled = true; };
  }, [token]);

  return (
    <AuthLayout title="Email Verification" subtitle="Confirm your email address" data-testid="verify-email-page">
      {state === "loading" && (
        <div className="flex flex-col items-center gap-3 py-4" data-testid="verify-email-loading">
          <div className="w-8 h-8 border-2 border-[#1e5c3a] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Verifying your email...</p>
        </div>
      )}
      {state === "success" && (
        <div className="space-y-4 text-center" data-testid="verify-email-success">
          <CheckCircle2 size={36} className="mx-auto text-emerald-600" />
          <p className="text-sm text-foreground leading-relaxed">
            Your email has been verified. You can now sign in and start placing bulk orders.
          </p>
          <Btn variant="primary" size="lg" className="w-full justify-center" onClick={() => setView("buyer-login")} data-testid="verify-email-login-button">
            Sign In
          </Btn>
        </div>
      )}
      {state === "error" && (
        <div className="space-y-4 text-center" data-testid="verify-email-error">
          <XCircle size={36} className="mx-auto text-red-600" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            {error || "Unable to verify your email."}
          </p>
          <Btn variant="primary" size="lg" className="w-full justify-center" onClick={() => setView("buyer-login")} data-testid="verify-email-back-button">
            Back to Sign In
          </Btn>
        </div>
      )}
    </AuthLayout>
  );
}
