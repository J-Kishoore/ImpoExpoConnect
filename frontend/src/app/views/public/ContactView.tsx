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

export function ContactView({ showToast }: { showToast: (m: string, t: "success" | "error" | "info") => void }) {
  const [sent, setSent] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    showToast("Inquiry submitted! We'll respond within 24 hours.", "success");
  };
  return (
    <div className="max-w-5xl mx-auto px-5 py-12">
      <div className="text-center mb-12">
        <p className="text-[#c47f2e] text-sm font-medium uppercase tracking-widest mb-2">Get in Touch</p>
        <h1 className="text-3xl font-semibold text-foreground" style={{ fontFamily: "Fraunces, serif" }}>Contact & Inquiry</h1>
      </div>
      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3">
          <Card className="p-6">
            {sent ? (
              <div className="text-center py-8">
                <CheckCircle size={40} className="text-emerald-600 mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Inquiry Submitted!</h3>
                <p className="text-sm text-muted-foreground">Our team will contact you within 24 business hours.</p>
                <Btn variant="secondary" className="mt-4" onClick={() => setSent(false)}>Send Another</Btn>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Full Name *</label>
                    <input required className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30 focus:border-[#1e5c3a]" placeholder="James Okonkwo" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Company Name *</label>
                    <input required className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30 focus:border-[#1e5c3a]" placeholder="Global Agri Imports Ltd" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Email *</label>
                    <input required type="email" className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30 focus:border-[#1e5c3a]" placeholder="james@globalagri.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Country</label>
                    <input className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30 focus:border-[#1e5c3a]" placeholder="Nigeria" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Products of Interest</label>
                  <input className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30 focus:border-[#1e5c3a]" placeholder="Basmati Rice, Toor Dal..." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Message *</label>
                  <textarea required rows={4} className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30 focus:border-[#1e5c3a] resize-none" placeholder="Describe your requirements, quantities, and destination..." />
                </div>
                <Btn variant="primary" size="lg" className="w-full justify-center">Submit Inquiry</Btn>
              </form>
            )}
          </Card>
        </div>
        <div className="md:col-span-2 space-y-4">
          {[
            { icon: MapPin, title: "Office", text: "Plot 14, APMC Yard, Vashi, Navi Mumbai — 400703, Maharashtra, India" },
            { icon: Phone, title: "Phone", text: "+91 98200 00000\n+91 22 4000 0000" },
            { icon: Mail, title: "Email", text: "trade@makgrowimpex.com\nsupport@makgrowimpex.com" },
            { icon: Clock, title: "Business Hours", text: "Mon–Sat: 9:00 AM – 6:30 PM IST\nClosed on Sundays & National Holidays" },
          ].map(c => (
            <Card key={c.title} className="p-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5"><c.icon size={16} /></div>
                <div>
                  <p className="text-xs font-semibold text-foreground mb-0.5">{c.title}</p>
                  <p className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">{c.text}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BUYER PORTAL
// ═══════════════════════════════════════════════════════════════════════════════
