import { LucideIcon } from 'lucide-react';

export interface CurriculumSection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  subjects: string[];
  image: string;
  Icon: LucideIcon;        // ✅ Store component reference, not JSX
  accent: string;
}