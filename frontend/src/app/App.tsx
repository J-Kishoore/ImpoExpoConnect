import { useState } from "react";
import type { View, Portal } from "./types";
import { portalTitles } from "./data";
import { Toast, ChatWidget } from "./components/shared";
import { PublicHeader, Sidebar, PortalTopBar } from "./components/layout";
import { HomeView, ProductsView, AboutView, ContactView } from "./views/public";
import {
  BuyerDashboard, BuyerCatalog, BuyerOrderForm, BuyerTracking, BuyerQuotations, BuyerPayment,
} from "./views/buyer";
import {
  AdminDashboard, AdminBuyers, AdminProducts, AdminOrders, AdminPayments, AdminReports,
} from "./views/admin";

export default function App() {
  const [view, setView] = useState<View>("home");
  const [portal, setPortal] = useState<Portal>("public");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" | "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const isPortal = portal !== "public";
  const offset = isPortal ? (sidebarCollapsed ? "ml-16" : "ml-56") : "";

  const renderContent = () => {
    switch (view) {
      case "home": return <HomeView setView={setView} setPortal={setPortal} />;
      case "products": return <ProductsView setView={setView} setPortal={setPortal} />;
      case "about": return <AboutView />;
      case "contact": return <ContactView showToast={showToast} />;
      case "buyer-dashboard": return <BuyerDashboard setView={setView} />;
      case "buyer-catalog": return <BuyerCatalog setView={setView} />;
      case "buyer-order-form": return <BuyerOrderForm showToast={showToast} />;
      case "buyer-tracking": return <BuyerTracking />;
      case "buyer-quotations": return <BuyerQuotations showToast={showToast} />;
      case "buyer-payment": return <BuyerPayment showToast={showToast} />;
      case "admin-dashboard": return <AdminDashboard />;
      case "admin-buyers": return <AdminBuyers showToast={showToast} />;
      case "admin-products": return <AdminProducts showToast={showToast} />;
      case "admin-orders": return <AdminOrders showToast={showToast} />;
      case "admin-payments": return <AdminPayments showToast={showToast} />;
      case "admin-reports": return <AdminReports showToast={showToast} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      {isPortal && (
        <>
          <Sidebar portal={portal} view={view} setView={setView} setPortal={setPortal}
            collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
          <PortalTopBar title={portalTitles[view] || ""} portal={portal} collapsed={sidebarCollapsed} />
        </>
      )}
      {!isPortal && <PublicHeader view={view} setView={setView} setPortal={setPortal} />}
      <main className={`transition-all duration-200 ${offset}`}>
        {isPortal ? (
          <div className="pt-16 p-6 min-h-screen">
            {renderContent()}
          </div>
        ) : (
          <div>{renderContent()}</div>
        )}
      </main>
      <ChatWidget />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
