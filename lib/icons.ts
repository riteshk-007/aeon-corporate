import {
  Award, BadgeCheck, Banknote, BookOpen, Briefcase, Building2, Calculator, ClipboardCheck,
  ClipboardList, Clock, Cpu, Droplets, FileCheck, FilePen, FileText, Flame, Factory, Fingerprint,
  Globe, Handshake, HeartHandshake, KeyRound, Landmark, Leaf, Lightbulb, ListOrdered, Lock,
  MapPin, Package, Percent, Phone, Pill, Plane, Receipt, Recycle, Rocket, Scale, ScrollText,
  Ship, ShieldCheck, ShoppingCart, Sparkles, Stamp, Star, Stethoscope, Store, Sun, Table2,
  Target, ThumbsUp, TrendingUp, Truck, UserCheck, Users, Utensils, Wallet, Zap,
  type LucideIcon,
} from "lucide-react"

/**
 * Icons an admin can choose for a page or a section. The key is what is saved
 * in the database; add a line here to offer one more icon.
 */
export const ICONS: Record<string, { label: string; Icon: LucideIcon }> = {
  "book-open": { label: "Book", Icon: BookOpen },
  "thumbs-up": { label: "Thumbs up", Icon: ThumbsUp },
  "clipboard-check": { label: "Checklist", Icon: ClipboardCheck },
  "clipboard-list": { label: "List", Icon: ClipboardList },
  "file-text": { label: "Document", Icon: FileText },
  "file-check": { label: "Approved document", Icon: FileCheck },
  "file-pen": { label: "Edit document", Icon: FilePen },
  "list-ordered": { label: "Steps", Icon: ListOrdered },
  sparkles: { label: "Sparkles", Icon: Sparkles },
  table: { label: "Table", Icon: Table2 },
  "shield-check": { label: "Shield", Icon: ShieldCheck },
  building: { label: "Company", Icon: Building2 },
  briefcase: { label: "Business", Icon: Briefcase },
  landmark: { label: "Government", Icon: Landmark },
  scale: { label: "Legal", Icon: Scale },
  stamp: { label: "Stamp", Icon: Stamp },
  scroll: { label: "Certificate", Icon: ScrollText },
  award: { label: "Award", Icon: Award },
  badge: { label: "Verified", Icon: BadgeCheck },
  globe: { label: "Global", Icon: Globe },
  factory: { label: "Factory", Icon: Factory },
  leaf: { label: "Environment", Icon: Leaf },
  recycle: { label: "Recycle", Icon: Recycle },
  sun: { label: "Solar", Icon: Sun },
  zap: { label: "Energy", Icon: Zap },
  flame: { label: "Fire", Icon: Flame },
  droplets: { label: "Water", Icon: Droplets },
  users: { label: "People", Icon: Users },
  "user-check": { label: "Verified person", Icon: UserCheck },
  handshake: { label: "Partnership", Icon: Handshake },
  "heart-handshake": { label: "NGO / Trust", Icon: HeartHandshake },
  banknote: { label: "Money", Icon: Banknote },
  wallet: { label: "Wallet", Icon: Wallet },
  calculator: { label: "Accounts", Icon: Calculator },
  receipt: { label: "Receipt", Icon: Receipt },
  percent: { label: "Tax", Icon: Percent },
  trending: { label: "Growth", Icon: TrendingUp },
  rocket: { label: "Startup", Icon: Rocket },
  lightbulb: { label: "Idea", Icon: Lightbulb },
  cpu: { label: "Technology", Icon: Cpu },
  truck: { label: "Transport", Icon: Truck },
  ship: { label: "Shipping", Icon: Ship },
  plane: { label: "Air / export", Icon: Plane },
  store: { label: "Shop", Icon: Store },
  cart: { label: "E-commerce", Icon: ShoppingCart },
  package: { label: "Product", Icon: Package },
  food: { label: "Food", Icon: Utensils },
  pill: { label: "Medicine", Icon: Pill },
  health: { label: "Health", Icon: Stethoscope },
  lock: { label: "Security", Icon: Lock },
  key: { label: "Key", Icon: KeyRound },
  fingerprint: { label: "Identity", Icon: Fingerprint },
  pin: { label: "Location", Icon: MapPin },
  phone: { label: "Phone", Icon: Phone },
  clock: { label: "Time", Icon: Clock },
  target: { label: "Target", Icon: Target },
  star: { label: "Star", Icon: Star },
}

export const ICON_KEYS = Object.keys(ICONS)

/** Icon for a saved key, falling back to a default so a page never shows a blank. */
export const iconFor = (key: string | null | undefined, fallback = "book-open"): LucideIcon =>
  (key && ICONS[key]?.Icon) || ICONS[fallback].Icon
