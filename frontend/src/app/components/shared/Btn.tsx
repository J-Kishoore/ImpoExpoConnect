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

export function Btn({ children, variant = "primary", size = "md", onClick, className = "" }: {
  children: React.ReactNode; variant?: "primary" | "secondary" | "ghost" | "accent" | "danger";
  size?: "sm" | "md" | "lg"; onClick?: () => void; className?: string;
}) {
  const base = "inline-flex items-center gap-1.5 font-medium rounded transition-all duration-150 cursor-pointer";
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" };
  const variants = {
    primary: "bg-[#1e5c3a] text-white hover:bg-[#174d30] shadow-sm",
    secondary: "bg-[#edeae3] text-[#1c1917] hover:bg-[#e0dbd0]",
    ghost: "text-[#78716c] hover:bg-[#edeae3] hover:text-[#1c1917]",
    accent: "bg-[#c47f2e] text-white hover:bg-[#ab6d26] shadow-sm",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
  };
  return (
    <button onClick={onClick} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}
