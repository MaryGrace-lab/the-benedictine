// lib/constants.ts
import { Users, GraduationCap, UserCheck, BookOpen } from 'lucide-react';

export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  users: Users,
  graduationCap: GraduationCap,
  userCheck: UserCheck,
  bookOpen: BookOpen,
};