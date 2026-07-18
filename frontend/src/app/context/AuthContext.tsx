import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import * as api from "../lib/api";
import type { AdminProfile, AdminRegisterPayload, BuyerProfile, BuyerRegisterPayload } from "../lib/api";

const STORAGE_KEY = "impoexpo.token";

type Role = "buyer" | "admin";
type Profile = BuyerProfile | AdminProfile;

type AuthContextValue = {
  role: Role | null;
  profile: Profile | null;
  token: string | null;
  isReady: boolean;
  loginBuyer: (email: string, password: string) => Promise<void>;
  registerBuyer: (payload: BuyerRegisterPayload) => Promise<void>;
  loginAdmin: (email: string, password: string) => Promise<void>;
  registerAdmin: (payload: AdminRegisterPayload) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY));
  const [role, setRole] = useState<Role | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!token) {
      setIsReady(true);
      return;
    }
    api
      .getMe(token)
      .then((res) => {
        if (cancelled) return;
        setRole(res.role);
        setProfile(res.profile);
      })
      .catch(() => {
        if (cancelled) return;
        localStorage.removeItem(STORAGE_KEY);
        setToken(null);
        setRole(null);
        setProfile(null);
      })
      .finally(() => {
        if (!cancelled) setIsReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  function persist(nextToken: string) {
    localStorage.setItem(STORAGE_KEY, nextToken);
    setToken(nextToken);
  }

  async function loginBuyer(email: string, password: string) {
    const res = await api.loginBuyer({ email, password });
    persist(res.token);
    setRole("buyer");
    setProfile(res.buyer);
  }

  async function registerBuyer(payload: BuyerRegisterPayload) {
    const res = await api.registerBuyer(payload);
    persist(res.token);
    setRole("buyer");
    setProfile(res.buyer);
  }

  async function loginAdmin(email: string, password: string) {
    const res = await api.loginAdmin({ email, password });
    persist(res.token);
    setRole("admin");
    setProfile(res.admin);
  }

  async function registerAdmin(payload: AdminRegisterPayload) {
    const res = await api.registerAdmin(payload);
    persist(res.token);
    setRole("admin");
    setProfile(res.admin);
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setRole(null);
    setProfile(null);
  }

  return (
    <AuthContext.Provider
      value={{ role, profile, token, isReady, loginBuyer, registerBuyer, loginAdmin, registerAdmin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
