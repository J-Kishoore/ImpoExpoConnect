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

export function AdminPayments({ showToast }: { showToast: (m: string, t: "success" | "error" | "info") => void }) {
  const payments = [
    { id: "PAY-041", order: "ORD-2024-0041", buyer: "Al Fajr Trading LLC", amount: "₹5,80,000", date: "11 Jun 2024", status: "Pending", file: "transfer_proof_jun11.pdf" },
    { id: "PAY-038", order: "ORD-2024-0038", buyer: "Nile Foods Co.", amount: "₹1,10,000", date: "09 Jun 2024", status: "Approved", file: "payment_nile_jun09.pdf" },
    { id: "PAY-035", order: "ORD-2024-0035", buyer: "Al Fajr Trading LLC", amount: "₹2,60,000", date: "04 Jun 2024", status: "Approved", file: "receipt_035.pdf" },
  ];
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Fraunces, serif" }}>Payment Verification</h2>
        <p className="text-sm text-muted-foreground">Review uploaded payment proofs and approve or reject.</p>
      </div>
      <div className="grid gap-4">
        {payments.map(p => (
          <Card key={p.id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#f0ece5] flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-[#c47f2e]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-foreground text-sm">{p.id}</p>
                    <Badge label={p.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">{p.order} · {p.buyer}</p>
                  <p className="text-xs text-muted-foreground">{p.date}</p>
                  <p className="text-sm font-semibold text-foreground mt-1" style={{ fontFamily: "JetBrains Mono, monospace" }}>{p.amount}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#f6f4f0] rounded-lg px-3 py-2 flex items-center gap-2">
                  <FileText size={12} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{p.file}</span>
                  <button className="text-[#1e5c3a] hover:text-[#174d30]"><Eye size={13} /></button>
                  <button className="text-[#1e5c3a] hover:text-[#174d30]"><Download size={13} /></button>
                </div>
                {p.status === "Pending" && (
                  <div className="flex gap-2">
                    <Btn variant="primary" size="sm" onClick={() => showToast(`Payment ${p.id} approved!`, "success")}><Check size={13} /> Approve</Btn>
                    <Btn variant="danger" size="sm" onClick={() => showToast(`Payment ${p.id} rejected.`, "error")}><X size={13} /> Reject</Btn>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
