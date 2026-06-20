export interface CurriculumSection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  subjects: string[];
  image: string;
  iconKey: string;   // 'bookOpen' | 'graduationCap' — plain string, not a component
  accent: string;
}