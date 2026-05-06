import { 
  GraduationCap, User, Users, Home, Info, BookOpen, 
  UserPlus, Phone, HelpCircle, Newspaper, Image as ImageIcon,
  MonitorPlay, LockKeyhole
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
  { name: 'Student Login', href: '/login/student', icon: GraduationCap, color: 'text-blue-600' },
  { name: 'Teacher Login', href: '/login/teacher', icon: User, color: 'text-emerald-600' },
  { name: 'Parent Login', href: '/login/parent', icon: Users, color: 'text-purple-600' },
];