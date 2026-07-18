import { useState } from "react";
import { BrowserRouter, useLocation, useNavigate } from "react-router";
import type { View } from "./types";
import { portalTitles } from "./data";
import { pathFromView, viewFromPath } from "./lib/routes";
import { Btn, Toast, ChatWidget } from "./components/shared";
import { PublicHeader, Sidebar, PortalTopBar } from "./components/layout";
import { HomeView, ProductsView, AboutView, ContactView } from "./views/public";
import {
  BuyerLogin, BuyerRegister,
  BuyerDashboard, BuyerCatalog, BuyerOrderForm, BuyerTracking, BuyerQuotations, BuyerPayment,
} from "./views/buyer";
import {
  AdminLogin, AdminRegister,
  AdminDashboard, AdminBuyers, AdminProducts, AdminOrders, AdminPayments, AdminReports,
} from "./views/admin";
import { AuthProvider, useAuth } from "./context/AuthContext";

const BUYER_VIEWS = new Set<View>([
  "buyer-dashboard", "buyer-catalog", "buyer-order-form", "buyer-tracking", "buyer-quotations", "buyer-payment",
]);
const ADMIN_VIEWS = new Set<View>([
  "admin-dashboard", "admin-buyers", "admin-products", "admin-orders", "admin-payments", "admin-reports",
]);

function NotFound({ setView }: { setView: (v: View) => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
      <h1 className="text-2xl font-semibold text-foreground" style={{ fontFamily: "Fraunces, serif" }}>Page not found</h1>
      <p className="text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
      <Btn variant="primary" onClick={() => setView("home")}>Back to Home</Btn>
    </div>
  );
}

function AppShell() {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const view = viewFromPath(location.pathname);
  const setView = (v: View) => navigate(pathFromView(v));

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" | "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  if (!auth.isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-[#1e5c3a] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (view === null) {
    return <NotFound setView={setView} />;
  }

  // Central RBAC gate: any buyer-/admin-only view falls back to that portal's
  // login screen unless the authenticated role actually matches.
  const renderContent = () => {
    if (BUYER_VIEWS.has(view) && auth.role !== "buyer") {
      return <BuyerLogin setView={setView} showToast={showToast} />;
    }
    if (ADMIN_VIEWS.has(view) && auth.role !== "admin") {
      return <AdminLogin setView={setView} showToast={showToast} />;
    }

    switch (view) {
      case "home": return <HomeView setView={setView} />;
      case "products": return <ProductsView setView={setView} />;
      case "about": return <AboutView />;
      case "contact": return <ContactView showToast={showToast} />;

      case "buyer-login":
        return auth.role === "buyer" ? <BuyerDashboard setView={setView} /> : <BuyerLogin setView={setView} showToast={showToast} />;
      case "buyer-register":
        return auth.role === "buyer" ? <BuyerDashboard setView={setView} /> : <BuyerRegister setView={setView} showToast={showToast} />;
      case "buyer-dashboard": return <BuyerDashboard setView={setView} />;
      case "buyer-catalog": return <BuyerCatalog setView={setView} />;
      case "buyer-order-form": return <BuyerOrderForm showToast={showToast} />;
      case "buyer-tracking": return <BuyerTracking />;
      case "buyer-quotations": return <BuyerQuotations showToast={showToast} />;
      case "buyer-payment": return <BuyerPayment showToast={showToast} />;

      case "admin-login":
        return auth.role === "admin" ? <AdminDashboard /> : <AdminLogin setView={setView} showToast={showToast} />;
      case "admin-register":
        return auth.role === "admin" ? <AdminDashboard /> : <AdminRegister setView={setView} showToast={showToast} />;
      case "admin-dashboard": return <AdminDashboard />;
      case "admin-buyers": return <AdminBuyers showToast={showToast} />;
      case "admin-products": return <AdminProducts showToast={showToast} />;
      case "admin-orders": return <AdminOrders showToast={showToast} />;
      case "admin-payments": return <AdminPayments showToast={showToast} />;
      case "admin-reports": return <AdminReports showToast={showToast} />;

      default: return null;
    }
  };

  const isPortalShell = (BUYER_VIEWS.has(view) && auth.role === "buyer") || (ADMIN_VIEWS.has(view) && auth.role === "admin");
  const offset = isPortalShell ? (sidebarCollapsed ? "ml-16" : "ml-56") : "";

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      {isPortalShell ? (
        <>
          <Sidebar view={view} setView={setView} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
          <PortalTopBar title={portalTitles[view] || ""} collapsed={sidebarCollapsed} />
        </>
      ) : (
        <PublicHeader view={view} setView={setView} />
      )}
      <main className={`transition-all duration-200 ${offset}`}>
        {isPortalShell ? (
          <div className="pt-16 p-6 min-h-screen">{renderContent()}</div>
        ) : (
          <div>{renderContent()}</div>
        )}
      </main>
      <ChatWidget />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}
