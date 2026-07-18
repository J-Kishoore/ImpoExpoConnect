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

export function AboutView() {
  return (
    <div className="max-w-7xl mx-auto px-5 py-12">
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <p className="text-[#c47f2e] text-sm font-medium uppercase tracking-widest mb-2">Our Story</p>
          <h1 className="text-4xl font-semibold text-foreground mb-5" style={{ fontFamily: "Fraunces, serif" }}>Connecting India's Fields to World Markets</h1>
          <p className="text-muted-foreground leading-relaxed mb-4">Founded in 2014, Makgrow Impex Pvt Ltd has grown to become one of India's most trusted agri-commodity export houses. We source directly from certified farmers and cooperative societies across Maharashtra, Punjab, Uttar Pradesh, and Rajasthan.</p>
          <p className="text-muted-foreground leading-relaxed mb-6">Our mission is to create transparent, efficient, and reliable trade corridors between Indian agricultural producers and international buyers — eliminating middlemen and ensuring quality from farm to port.</p>
          <div className="flex flex-wrap gap-4">
            {[
              { label: "Founded", val: "2014" },
              { label: "Export Markets", val: "34 Countries" },
              { label: "Annual Volume", val: "12,000+ MT" },
            ].map(s => (
              <div key={s.label} className="bg-[#edeae3] rounded-lg px-4 py-3">
                <p className="text-lg font-semibold text-foreground" style={{ fontFamily: "Fraunces, serif" }}>{s.val}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl overflow-hidden h-80 bg-[#e5e1d8]">
          <img src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&h=400&fit=crop&auto=format"
            alt="Agricultural fields" className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-6">
        {[
          { icon: Star, title: "Certified Quality", desc: "APEDA registered, FSSAI certified, ISO 22000 compliant. Every lot undergoes multi-stage quality testing." },
          { icon: Shield, title: "Compliance-First", desc: "Full phytosanitary compliance, pest-free certificates, and country-specific import documentation." },
          { icon: Globe, title: "Logistics Network", desc: "Partnerships with major freight forwarders for Mumbai, Chennai, and JNPT port dispatch." },
        ].map(f => (
          <Card key={f.title} className="p-6">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4"><f.icon size={18} /></div>
            <h3 className="font-semibold text-foreground mb-1.5">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
