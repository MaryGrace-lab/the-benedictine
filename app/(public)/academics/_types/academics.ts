export interface CurriculumSection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  subjects: string[];
  image: string;
  iconKey: 'bookOpen' | 'graduationCap';
  accent: string;
}