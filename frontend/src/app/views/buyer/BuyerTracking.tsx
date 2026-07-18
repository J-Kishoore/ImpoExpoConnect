import { useState, useRef } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Package, ShoppingCart, FileText, CreditCard, MessageCircle, Bell, ChevronDown,
  Menu, X, Home, Users, Settings, LogOut, TrendingUp, Check, Clock, AlertCircle,
  Upload, Download, Eye, Search, Filter, ChevronRight, Star, Leaf, Globe,
  Phone, Mail, MapPin, ArrowRight, BarChart2, Shield, Truck, Plus,
  CheckCircle, XCircle, Send, Paperclip, MoreVertical, Edit2, Trash2,
  FileDown, Printer, RefreshCw, ChevronUp, DollarSign, Archive,
} from "lucide-react";
import type { View, Portal } from "../../types";
import { products, orders, buyers, revenueData, activityFeed, chatMessages, statusColors } from "../../data";
import { Badge, Btn, Card, StatCard, Toast, ChatWidget } from "../../components/shared";

export function BuyerTracking() {
  const [selected, setSelected] = useState(orders[0]);
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Fraunces, serif" }}>Order Tracking</h2>
        <p className="text-sm text-muted-foreground">Real-time status for all your orders.</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="space-y-2">
          {orders.map(o => (
            <button key={o.id} onClick={() => setSelected(o)}
              className={`w-full text-left p-4 rounded-lg border transition-all ${selected.id === o.id ? "border-[#1e5c3a] bg-emerald-50/50" : "border-border bg-card hover:border-[#1e5c3a]/30"}`}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-foreground">{o.product}</p>
                <Badge label={o.status} />
              </div>
              <p className="text-xs text-muted-foreground">{o.id} · {o.qty}</p>
              <p className="text-xs text-muted-foreground">{o.date}</p>
            </button>
          ))}
        </div>
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-foreground">{selected.product}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{selected.id} · {selected.qty} · {selected.date}</p>
              </div>
              <Badge label={selected.status} />
            </div>
            {/* Step Tracker */}
            <div className="relative mb-8">
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-[#e5e1d8]" />
              <div
                className="absolute top-4 left-4 h-0.5 bg-[#1e5c3a] transition-all duration-500"
                style={{ width: `${(selected.step / (orderSteps.length - 1)) * (100 - 8)}%` }}
              />
              <div className="relative flex justify-between">
                {orderSteps.map((step, i) => {
                  const done = i < selected.step;
                  const current = i === selected.step;
                  return (
                    <div key={step} className="flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 relative border-2 text-xs font-semibold transition-all ${done ? "bg-[#1e5c3a] border-[#1e5c3a] text-white" : current ? "bg-white border-[#1e5c3a] text-[#1e5c3a]" : "bg-white border-[#e5e1d8] text-muted-foreground"}`}>
                        {done ? <Check size={14} /> : i + 1}
                      </div>
                      <p className={`text-[10px] font-medium text-center ${current ? "text-[#1e5c3a]" : done ? "text-foreground" : "text-muted-foreground"}`}>{step}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: "Order ID", val: selected.id },
                { label: "Product", val: selected.product },
                { label: "Quantity", val: selected.qty },
                { label: "Order Date", val: selected.date },
                { label: "Shipment Date", val: "Est. 20 Jun 2024" },
                { label: "Port of Loading", val: "JNPT, Navi Mumbai" },
              ].map(d => (
                <div key={d.label} className="bg-[#f6f4f0] rounded-lg p-3">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">{d.label}</p>
                  <p className="text-sm font-medium text-foreground">{d.val}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
