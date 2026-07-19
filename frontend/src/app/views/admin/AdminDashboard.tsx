import { useEffect, useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ShoppingCart, Users, Clock, ChevronRight, DollarSign } from "lucide-react";
import { Card, StatCard } from "../../components/shared";
import { useAuth } from "../../context/AuthContext";
import { ApiError, getDashboardStats } from "../../lib/api";
import type { DashboardStats } from "../../lib/api";
import type { View } from "../../types";

function formatCompactUsd(value: number): string {
  if (value === 0) return "$0";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export function AdminDashboard({ setView }: { setView: (v: View) => void }) {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    getDashboardStats(token)
      .then(res => setStats(res.stats))
      .catch(err => console.error(err instanceof ApiError ? err.message : "Failed to load dashboard stats."))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return <Card className="p-8 text-center text-sm text-muted-foreground">Loading dashboard...</Card>;
  }
  if (!stats) {
    return <Card className="p-8 text-center text-sm text-muted-foreground">Unable to load dashboard data.</Card>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Fraunces, serif" }}>Admin Overview</h2>
        <p className="text-sm text-muted-foreground">All operations summary</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ShoppingCart} label="Total Orders" value={String(stats.totalOrders)} sub={`+${stats.newOrdersThisWeek} this week`} color="green" />
        <StatCard icon={Clock} label="Pending Approvals" value={String(stats.pendingApprovals)} sub="Needs action" color="amber" />
        <StatCard icon={DollarSign} label="Revenue" value={formatCompactUsd(stats.completedRevenue)} sub="From completed orders" color="blue" />
        <StatCard icon={Users} label="Active Buyers" value={String(stats.activeBuyers)} sub={`${stats.newBuyersThisMonth} new this month`} color="slate" />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-semibold text-sm text-foreground mb-4">Monthly Revenue (Completed Orders)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e1d8" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#78716c" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#78716c" }} axisLine={false} tickLine={false} tickFormatter={formatCompactUsd} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e1d8", fontSize: 12 }} formatter={(v: number) => formatCompactUsd(v)} />
              <Bar dataKey="revenue" fill="#1e5c3a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold text-sm text-foreground mb-4">Order Volume</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stats.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e1d8" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#78716c" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#78716c" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e1d8", fontSize: 12 }} />
              <Line type="monotone" dataKey="orders" stroke="#c47f2e" strokeWidth={2} dot={{ fill: "#c47f2e", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-semibold text-sm text-foreground mb-4">Pending Actions</h3>
          {stats.pendingActions.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing needs your attention right now.</p>
          ) : (
            <div className="space-y-2">
              {stats.pendingActions.map(a => (
                <button key={a.id} onClick={() => setView(a.target)}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-[#f6f4f0] hover:bg-[#f0ece5] cursor-pointer transition-colors text-left">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${a.urgency === "high" ? "bg-red-500" : "bg-amber-500"}`} />
                    <p className="text-sm text-foreground">{a.label}</p>
                  </div>
                  <ChevronRight size={14} className="text-muted-foreground" />
                </button>
              ))}
            </div>
          )}
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold text-sm text-foreground mb-4">Top Products by Volume</h3>
          {stats.topProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No order volume yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.topProducts.map(p => (
                <div key={p.productName}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-foreground">{p.productName}</span>
                    <span className="text-muted-foreground" style={{ fontFamily: "JetBrains Mono, monospace" }}>{p.qty} MT</span>
                  </div>
                  <div className="h-1.5 bg-[#e5e1d8] rounded-full overflow-hidden">
                    <div className="h-full bg-[#1e5c3a] rounded-full transition-all" style={{ width: `${p.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
