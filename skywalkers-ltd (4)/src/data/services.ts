import {
  Smartphone, Share2, Database, Building2, FileText, Landmark, Wallet,
  IdCard, Plane, Home as HomeIcon, ShieldCheck, GraduationCap, MapPinned,
  type LucideIcon,
} from "lucide-react";

export interface BizService {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export const bizServices: BizService[] = [
  { icon: Smartphone, title: "Web Design", desc: "Fast, mobile-first sites that turn visits into calls and orders." },
  { icon: Smartphone, title: "Mobile App Design", desc: "Customer or staff apps for ordering, bookings, and loyalty." },
  { icon: Share2, title: "Social Media Setup", desc: "Business pages built, branded, and scheduled — not left dormant." },
  { icon: Database, title: "Database Management", desc: "Customers, stock, and sales in one clean, searchable system." },
  { icon: Building2, title: "Company Registration", desc: "Full incorporation, filed and followed up until you're live." },
  { icon: FileText, title: "Business Registration", desc: "Sole proprietorship and business name registration, done right." },
  { icon: Landmark, title: "Sacco Registration", desc: "From constitution to certificate — sacco registration handled." },
  { icon: Wallet, title: "Payroll Management", desc: "Salaries, statutory deductions, and payslips, every month, on time." },
];

export interface ServiceItem {
  name: string;
  docs: string[];
}

export interface CitizenCategory {
  icon: LucideIcon;
  title: string;
  items: ServiceItem[];
}

export const citizenCategories: CitizenCategory[] = [
  {
    icon: IdCard,
    title: "Identity & Civil Registration",
    items: [
      { name: "National ID application / replacement", docs: ["Birth certificate", "Parent's ID (if first ID)", "2 passport photos"] },
      { name: "Birth certificate", docs: ["Notification of birth", "Parents' ID copies"] },
      { name: "Marriage certificate", docs: ["ID copies of both parties", "Notice of intention to marry"] },
      { name: "KRA PIN registration", docs: ["National ID", "Active phone number & email"] },
    ],
  },
  {
    icon: Plane,
    title: "Travel & Mobility",
    items: [
      { name: "ePassport application", docs: ["National ID", "Birth certificate", "Passport photo (eCitizen spec)"] },
      { name: "Driving licence application", docs: ["National ID", "Medical certificate", "NTSA test pass slip"] },
      { name: "Vehicle registration/transfer", docs: ["Logbook", "ID of buyer & seller", "Sale agreement"] },
    ],
  },
  {
    icon: HomeIcon,
    title: "Property & Housing",
    items: [
      { name: "Land search (Ardhisasa)", docs: ["Title deed number or parcel number", "ID"] },
      { name: "Title deed application", docs: ["Land search result", "Sale agreement / succession docs"] },
      { name: "Boma Yangu registration", docs: ["National ID", "KRA PIN"] },
    ],
  },
  {
    icon: ShieldCheck,
    title: "Compliance & Clearance",
    items: [
      { name: "Police clearance (Good Conduct)", docs: ["National ID", "Fingerprint slip"] },
      { name: "NHIF / SHA registration", docs: ["National ID", "KRA PIN"] },
      { name: "NSSF registration & statement", docs: ["National ID", "Employer details"] },
    ],
  },
  {
    icon: GraduationCap,
    title: "Education & Family",
    items: [
      { name: "KUCCPS placement", docs: ["KCSE index number", "National ID"] },
      { name: "KNEC certificate verification", docs: ["Index number", "Year of exam"] },
    ],
  },
  {
    icon: MapPinned,
    title: "County-Level Services",
    items: [
      { name: "Single Business Permit", docs: ["National ID", "KRA PIN", "Premises location"] },
      { name: "Land rates clearance", docs: ["Parcel number", "Previous rates receipt"] },
      { name: "County trade/health/fire licence", docs: ["Business permit", "Premises inspection"] },
    ],
  },
];
