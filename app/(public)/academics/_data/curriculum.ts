import { CurriculumSection } from '../_types/academics';

export const curriculumSections: CurriculumSection[] = [
  {
    id: 'primary',
    title: 'Primary Section',
    subtitle: 'Nursery – Primary 6',
    description: 'Our primary section provides a strong foundation in literacy, numeracy, and social skills through interactive and child-centered teaching methods in a nurturing environment.',
    subjects: [
      'English Language', 'Mathematics', 'CRS', 'Civic Education', 'Verbal & Quantitative Reasoning', 
      'Programming', 'Basic Science & Technology', 'Social Studies', 'Creative Arts', 'ICT', 
      'Martial Arts', 'Religious Studies', 'Music', 'Agricultural Science', 'Home Economics', 
      'Writing', 'Diction', 'Public Speaking', 'Numeracy', 'Physical Education', 'Moral Education', 'Engineering'
    ],
    image: '/primary.jpg',
    iconKey: 'bookOpen',
    accent: "bg-amber-100 text-amber-900"
  },
  {
    id: 'secondary',
    title: 'Secondary Section',
    subtitle: 'JSS 1 – SS 3',
    description: 'Our secondary program offers a rigorous academic curriculum designed to prepare students for national examinations (WAEC, NECO) and global leadership opportunities.',
    subjects: [
      'English Studies', 'Mathematics', 'Further Mathematics', 'Physics', 'Chemistry', 'Biology', 
      'Financial Accounting', 'Geography', 'Literature In English', 'Marketing', 'Government', 
      'Economics', 'Commerce', 'Martial Arts', 'Music', 'Agricultural Science', 'Home Economics', 
      'Programming', 'Engineering', 'Technical Drawing', 'Project Defence'
    ],
    image: '/secondary.jpg',
    iconKey: 'graduationCap',
    accent: "bg-orange-100 text-orange-900"
  },
];