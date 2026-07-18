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

export function AdminProducts({ showToast }: { showToast: (m: string, t: "success" | "error" | "info") => void }) {
  const [availability, setAvailability] = useState<Record<number, boolean>>(
    Object.fromEntries(products.map(p => [p.id, p.stock === "Available"]))
  );
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Fraunces, serif" }}>Product Management</h2>
          <p className="text-sm text-muted-foreground">Manage catalog items and availability.</p>
        </div>
        <Btn variant="primary" size="sm"><Plus size={14} /> Add Product</Btn>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(p => (
          <Card key={p.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-foreground text-sm">{p.name}</h3>
                <p className="text-xs text-muted-foreground">{p.category}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium ${availability[p.id] ? "text-emerald-700" : "text-muted-foreground"}`}>
                  {availability[p.id] ? "On" : "Off"}
                </span>
                <button onClick={() => {
                  setAvailability(a => ({ ...a, [p.id]: !a[p.id] }));
                  showToast(`${p.name} availability updated.`, "success");
                }}
                  className={`w-9 h-5 rounded-full transition-all relative ${availability[p.id] ? "bg-[#1e5c3a]" : "bg-[#e5e1d8]"}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${availability[p.id] ? "left-4.5" : "left-0.5"}`} style={{ left: availability[p.id] ? "calc(100% - 1.125rem)" : "0.125rem" }} />
                </button>
              </div>
            </div>
            <p className="text-sm font-semibold text-[#1e5c3a] mb-1" style={{ fontFamily: "JetBrains Mono, monospace" }}>{p.price} / {p.unit}</p>
            <p className="text-xs text-muted-foreground mb-3">Min order: {p.minOrder}</p>
            <div className="flex gap-2">
              <Btn variant="secondary" size="sm" className="flex-1 justify-center"><Edit2 size={12} /> Edit</Btn>
              <button className="p-1.5 rounded text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 size={14} /></button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
