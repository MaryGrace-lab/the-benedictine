import { Heart, Shield, Star, Users, BookOpen, LucideIcon } from 'lucide-react';

export interface CoreValue {
  name: string;
  Icon: LucideIcon;  // Store the component itself, not JSX
}

export const coreValues: CoreValue[] = [
  { name: 'Faith', Icon: Heart },
  { name: 'Discipline', Icon: Shield },
  { name: 'Excellence', Icon: Star },
  { name: 'Integrity', Icon: Users },
  { name: 'Service', Icon: BookOpen }
];