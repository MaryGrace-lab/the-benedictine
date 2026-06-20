import { 
  GraduationCap, User, Users, Home, Info, BookOpen, 
  UserPlus, Phone, HelpCircle, Newspaper, Image as ImageIcon, LockKeyhole
} from "lucide-react";

export const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: Info },
  { href: "/academics", label: "Academics", icon: BookOpen },
  { href: "/admission", label: "Admission", icon: UserPlus },
  { href: "/contact", label: "Contact", icon: Phone },
  { href: "/FAQ", label: "FAQ", icon: HelpCircle },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/gallery", label: "Gallery", icon: ImageIcon },
];

export const portalOptions = [
  { name: 'Admin Login', href: '/admin-portal/login', icon: LockKeyhole, color: 'text-red-600' },
  { name: 'Student Login', href: '/student-portal/login', icon: GraduationCap, color: 'text-blue-600' },
  { name: 'Teacher Login', href: '/teacher-portal/login', icon: User, color: 'text-emerald-600' },
];