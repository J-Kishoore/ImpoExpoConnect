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

export function BuyerOrderForm({ showToast }: { showToast: (m: string, t: "success" | "error" | "info") => void }) {
  const [submitted, setSubmitted] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast("Order request submitted! Quotation will arrive within 24 hours.", "success");
  };
  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Fraunces, serif" }}>Bulk Order Request</h2>
        <p className="text-sm text-muted-foreground">Fill in the details and we'll send a formal quotation within 24 hours.</p>
      </div>
      {submitted ? (
        <Card className="p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={28} className="text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2" style={{ fontFamily: "Fraunces, serif" }}>Request Submitted!</h3>
          <p className="text-sm text-muted-foreground mb-1">Order ID: <span className="font-mono font-medium text-foreground">ORD-2024-0043</span></p>
          <p className="text-sm text-muted-foreground mb-6">Our team will review and send a quotation to your registered email within 24 business hours.</p>
          <Btn variant="secondary" onClick={() => setSubmitted(false)}>Submit Another Request</Btn>
        </Card>
      ) : (
        <Card className="p-6">
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Product *</label>
              <select required className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30 focus:border-[#1e5c3a]">
                <option value="">Select a product</option>
                {products.map(p => <option key={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Quantity (MT) *</label>
                <input required type="number" min="1" className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30 focus:border-[#1e5c3a]" placeholder="e.g. 10" />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Delivery Port</label>
                <input className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30 focus:border-[#1e5c3a]" placeholder="e.g. Port Rashid, Dubai" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Preferred Shipment Date</label>
                <input type="date" className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30 focus:border-[#1e5c3a]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Trade Term</label>
                <select className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30 focus:border-[#1e5c3a]">
                  <option>FOB Mumbai</option>
                  <option>CIF Destination</option>
                  <option>CFR Destination</option>
                  <option>EXW Factory</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Quality Specification</label>
              <input className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30 focus:border-[#1e5c3a]" placeholder="e.g. Grade A, 5% broken max, moisture 12%" />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Additional Notes</label>
              <textarea rows={3} className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30 focus:border-[#1e5c3a] resize-none" placeholder="Any special requirements, packing preferences, certifications needed..." />
            </div>
            <div className="flex gap-3 pt-2">
              <Btn variant="primary" size="lg">Submit Request</Btn>
              <Btn variant="secondary" size="lg" onClick={() => {}}>Save Draft</Btn>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}

const orderSteps = ["Requested", "Quoted", "Approved", "In Progress", "Completed"];
