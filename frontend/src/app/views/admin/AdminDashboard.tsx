import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ShoppingCart, Users, Clock, ChevronRight, DollarSign } from "lucide-react";
import { revenueData } from "../../data";
import { Card, StatCard } from "../../components/shared";

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Fraunces, serif" }}>Admin Overview</h2>
        <p className="text-sm text-muted-foreground">June 2024 — All operations summary</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ShoppingCart} label="Total Orders" value="147" sub="+12 this week" color="green" />
        <StatCard icon={Clock} label="Pending Approvals" value="8" sub="Needs action" color="amber" />
        <StatCard icon={DollarSign} label="Revenue (Jun)" value="$8.4M" sub="↑ 18% vs May" color="blue" />
        <StatCard icon={Users} label="Active Buyers" value="42" sub="3 new this month" color="slate" />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-semibold text-sm text-foreground mb-4">Monthly Revenue ($ Million)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e1d8" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#78716c" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#78716c" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e1d8", fontSize: 12 }} />
              <Bar dataKey="revenue" fill="#1e5c3a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold text-sm text-foreground mb-4">Order Volume</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e1d8" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#78716c" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#78716c" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e1d8", fontSize: 12 }} />
              <Line type="monotone" dataKey="orders" stroke="#c47f2e" strokeWidth={2} dot={{ fill: "#c47f2e", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-semibold text-sm text-foreground mb-4">Pending Actions</h3>
          <div className="space-y-2">
            {[
              { label: "Order ORD-2024-0043 — new request", type: "order", urgency: "high" },
              { label: "Payment PAY-041 — proof uploaded", type: "payment", urgency: "high" },
              { label: "Buyer B-003 registration pending", type: "buyer", urgency: "medium" },
              { label: "Quotation for ORD-2024-0038 overdue", type: "quote", urgency: "medium" },
            ].map((a, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#f6f4f0] hover:bg-[#f0ece5] cursor-pointer transition-colors">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${a.urgency === "high" ? "bg-red-500" : "bg-amber-500"}`} />
                  <p className="text-sm text-foreground">{a.label}</p>
                </div>
                <ChevronRight size={14} className="text-muted-foreground" />
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold text-sm text-foreground mb-4">Top Products by Volume</h3>
          <div className="space-y-3">
            {[
              { name: "Basmati Rice", vol: "4,200 MT", pct: 35 },
              { name: "Red Onions", vol: "2,800 MT", pct: 23 },
              { name: "Wheat Flour", vol: "2,100 MT", pct: 18 },
              { name: "Toor Dal", vol: "1,600 MT", pct: 14 },
            ].map(p => (
              <div key={p.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-foreground">{p.name}</span>
                  <span className="text-muted-foreground" style={{ fontFamily: "JetBrains Mono, monospace" }}>{p.vol}</span>
                </div>
                <div className="h-1.5 bg-[#e5e1d8] rounded-full overflow-hidden">
                  <div className="h-full bg-[#1e5c3a] rounded-full transition-all" style={{ width: `${p.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
